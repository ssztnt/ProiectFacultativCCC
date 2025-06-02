import React, {useEffect, useMemo, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import AppColor from '../constants/AppColor';
import AppLayout from '../components/AppLayout';
import MapView, {Marker, Region} from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {IPaddress} from "@/constants/NetworkConfig";
import { Animated } from 'react-native';
import {Ionicons} from "@expo/vector-icons";

interface Issue {
    id: number;
    title: string;
    description: string;
    status: string;
    imageUrl?: string;
    createdAt: string;
    latitude: number;
    longitude: number;
}

export default function HomeScreen() {
    const [reportCount, setReportCount] = useState();
    const [resolvedCount, setResolvedCount] = useState();

    const [issues, setIssues] = useState<Issue[]>([]);

    const fetchReports = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${IPaddress}/api/issues`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setIssues(data);
                setReportCount(data.length);
                setResolvedCount(data.filter((issue: Issue) => issue.status === 'RESOLVED').length);

            }
        } catch (err) {
            console.error('Failed to fetch reports:', err);
        }
    };
    const ecoFacts = [
        "Trash today, clean tomorrow! 🌍",
        "Report pollution. Help your city! 🏙️",
        "Nature loves clean neighborhoods 🌿",
        "Be the change. Report waste ♻️",
        "Small reports, big impact 💪",
        "A cleaner city starts with you 🚮",
        "Don't ignore it, report it! 🚨",
        "Act now, breathe better tomorrow 💨",
        "Protect trees. Report illegal dumping 🌲",
        "Together for a cleaner planet 🌎",
        "Fix problems, earn eco-points! 🎯",
        "Let’s keep our parks clean! 🛝",
        "Each report helps your city thrive 🌆",
        "See trash? Report it fast! ⏱️",
        "Be proud. Be eco! 💚",
        "Cleaner streets mean safer walks 🚶",
        "Report, relax, repeat! 🔁",
        "Air pollution starts on the ground 🌫️",
        "Floods love litter. Stop it! 💧",
        "Don't scroll. Patrol! 📱🚶",
    ];

    useEffect(() => {
        fetchReports();
    }, []);

    const [region, setRegion] = useState<Region>({
        latitude: 46.77828448142628,
        longitude: 23.628237046189795,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const memoizedMarkers = useMemo(() => issues.map(issue => (
        <Marker
            key={issue.id}
            coordinate={{ latitude: issue.latitude, longitude: issue.longitude }}
            title={issue.title}
            description={issue.description}
            pinColor={
                issue.status === 'OPEN' ? 'red' :
                    issue.status === 'IN_PROGRESS' ? 'yellow' :
                        issue.status === 'RESOLVED' ? 'green' :
                            'blue'
            }
        />
    )), [issues]);

    const [expanded] = useState(false);

    const [factIndex, setFactIndex] = useState(0);

    const [fadeAnim] = useState(new Animated.Value(1));

    const nextFact = () => {
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true })
        ]).start(() => {
            setFactIndex((prev) => (prev + 1) % ecoFacts.length);
        });
    };

    const prevFact = () => {
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true })
        ]).start(() => {
            setFactIndex((prev) => (prev - 1 + ecoFacts.length) % ecoFacts.length);
        });
    };

    const goToMyLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Location permission refused.');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    };

    return (
        <AppLayout>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.welcome}>Welcome back! 🌿</Text>

                <View style={styles.statsCard}>
                    <Text style={styles.statsTitle}>Community Stats</Text>
                    <Text style={styles.statsText}>📌 {reportCount} issues reported</Text>
                    <Text style={styles.statsText}>✅ {resolvedCount} issues resolved</Text>
                </View>

                <View style={styles.tipsCard}>
                    <Text style={styles.tipTitle}>Did you know?</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={prevFact}>
                            <Ionicons name="chevron-back" size={20} color="#444" />
                        </TouchableOpacity>

                        <Animated.Text style={[styles.tipText, { flex: 1, textAlign: 'center', opacity: fadeAnim }]}>
                            {ecoFacts[factIndex]}
                        </Animated.Text>

                        <TouchableOpacity onPress={nextFact}>
                            <Ionicons name="chevron-forward" size={20} color="#444" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.quickAction} onPress={() => router.replace('/ReportIssueScreen')}>
                    <Text style={styles.quickText}>🚨 Report a problem now</Text>
                </TouchableOpacity>

                <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 20 }} />

                <Text style={styles.title}>🗺️ Cluj-Napoca Map</Text>

                <TouchableOpacity style={styles.mapWrapper}>
                    <MapView
                        style={[styles.map, expanded && styles.mapExpanded]}
                        initialRegion={region}
                    >
                        {memoizedMarkers}
                        <Marker pinColor={'blue'} coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
                    </MapView>
                </TouchableOpacity>

                <TouchableOpacity onPress={goToMyLocation} style={styles.locationBtn}>
                    <Text style={styles.locationText}>📍 My Location</Text>
                </TouchableOpacity>
            </ScrollView>
        </AppLayout>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingTop: 100,
        paddingHorizontal: 16,
        paddingBottom: 120,
    },
    welcome: {
        fontSize: 26,
        fontWeight: 'bold',
        color: AppColor.primary,
        textAlign: 'center',
        marginBottom: 24,
        fontStyle: 'italic',
        textShadowColor: '#ccc',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    statsCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 4,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
    },
    statsText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    tipsCard: {
        backgroundColor: '#DFF6E3',
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        alignItems: 'center',
    },
    tipTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: AppColor.primary,
        marginBottom: 10,
        textAlign: 'center',
    },
    tipText: {
        fontSize: 16,
        color: '#444',
        paddingHorizontal: 12,
        fontWeight: '500',
    },
    quickAction: {
        backgroundColor: '#FFD700',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 30,
    },
    quickText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
    },
    container: {
        flex: 1,
        backgroundColor: AppColor.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: AppColor.primary,
        marginBottom: 10,
        textAlign: 'center',
    },
    mapWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    mapExpanded: {
        height: Dimensions.get('window').height * 0.6,
    },
    locationBtn: {
        marginTop: 20,
        backgroundColor: AppColor.primary,
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    locationText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    backText: {
        fontSize: 16,
        color: AppColor.primary,
        fontWeight: '600',
    },
    backButton: {
        position: 'absolute',
        top: 70,
        left: 16,
        zIndex: 100,
    },
});