import React, {useState, useRef, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';
import { styles } from '../constants/dispatchScreenStyle';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {IPaddress} from "@/constants/NetworkConfig";
import MapView, {Marker, Region} from "react-native-maps";
import * as Location from "expo-location";

const { width } = Dimensions.get('window');

const policeColors = Colors.police;

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

export default function PompieriDispatchScreen() {
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: selectedTeam ? 1.02 : 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start();
    }, [selectedTeam]);

    const [, setReportCount] = useState();
    const [, setResolvedCount] = useState();

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

    const goToMyLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission for location denied.');
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

    const teams = [
        {
            id: 'unit1',
            name: 'Unit 1',
            code: 'P-01',
            members: ['Popescu', 'Ionescu', 'Georgescu'],
            truck: 'Dacia Duster',
            location: 'Str. Libertății',
            status: 'Ready',
            gradient: policeColors.gradient,
            icon: '🚓',
        },
        {
            id: 'unit2',
            name: 'Unit 2',
            code: 'P-02',
            members: ['Marin', 'Nistor', 'Zaharia'],
            truck: 'VW Passat',
            location: 'Bd. Unirii',
            status: 'Ready',
            gradient: policeColors.gradient,
            icon: '🚔',
        },
    ];

    const handleTeamSelect = (teamId: string) => {
        setSelectedTeam(selectedTeam === teamId ? null : teamId);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[policeColors.background, '#f8f9fa']}
                style={StyleSheet.absoluteFillObject}
            />
            <ScrollView>
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <Text style={styles.title}>🚨 Emergency Dispatch</Text>
                    <Text style={styles.subtitle}>Select a team to deploy</Text>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.teamsContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    {teams.map((team, index) => {
                        const isSelected = selectedTeam === team.id;

                        return (
                            <Animated.View
                                key={team.id}
                                style={[
                                    styles.teamWrapper,
                                    {
                                        transform: [{
                                            scale: isSelected ? scaleAnim : 1
                                        }]
                                    }
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => handleTeamSelect(team.id)}
                                    activeOpacity={0.9}
                                    style={styles.teamTouchable}
                                >
                                    <LinearGradient
                                        colors={isSelected ? policeColors.gradient as [string, string] : ['#ffffff', '#f8f9fa']}
                                        style={[
                                            styles.teamCard,
                                            isSelected && styles.selectedCard
                                        ]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        {/* Header */}
                                        <View style={styles.teamHeader}>
                                            <View style={styles.teamHeaderLeft}>
                                                <Text style={styles.teamIcon}>{team.icon}</Text>
                                                <View>
                                                    <Text style={[
                                                        styles.teamName,
                                                        { color: isSelected ? '#fff' : policeColors.primaryDark }
                                                    ]}>
                                                        {team.name}
                                                    </Text>
                                                    <Text style={[
                                                        styles.teamCode,
                                                        { color: isSelected ? '#ffffff90' : '#666' }
                                                    ]}>
                                                        {team.code}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={[
                                                styles.statusBadge,
                                                { backgroundColor: isSelected ? '#ffffff20' : '#00D68F20' }
                                            ]}>
                                                <Text style={[
                                                    styles.statusText,
                                                    { color: isSelected ? '#fff' : '#00D68F' }
                                                ]}>
                                                    {team.status}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Team Members */}
                                        <View style={styles.membersSection}>
                                            <Text style={[
                                                styles.sectionLabel,
                                                { color: isSelected ? '#ffffff90' : '#666' }
                                            ]}>
                                                Team Members ({team.members.length})
                                            </Text>
                                            <View style={styles.membersGrid}>
                                                {team.members.map((member, memberIndex) => (
                                                    <View key={memberIndex} style={[
                                                        styles.memberChip,
                                                        { backgroundColor: isSelected ? '#ffffff20' : '#f1f3f4' }
                                                    ]}>
                                                        <Text style={[
                                                            styles.memberName,
                                                            { color: isSelected ? '#fff' : '#333' }
                                                        ]}>
                                                            {member}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>

                                        {/* Equipment & Location */}
                                        <View style={styles.detailsSection}>
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailIcon}>🚗</Text>
                                                <Text style={[
                                                    styles.detailText,
                                                    { color: isSelected ? '#ffffff90' : '#666' }
                                                ]}>
                                                    {team.truck}
                                                </Text>
                                            </View>
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailIcon}>📍</Text>
                                                <Text style={[
                                                    styles.detailText,
                                                    { color: isSelected ? '#ffffff90' : '#666' }
                                                ]}>
                                                    {team.location}
                                                </Text>
                                            </View>
                                        </View>

                                        {isSelected && (
                                            <Animated.View style={styles.deployButton}>
                                                <LinearGradient
                                                    colors={['#ffffff20', '#ffffff10']}
                                                    style={styles.deployButtonGradient}
                                                >
                                                    <Text style={styles.deployButtonText}>
                                                        🚀 DEPLOY NOW
                                                    </Text>
                                                </LinearGradient>
                                            </Animated.View>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </Animated.View>

                <TouchableOpacity style={mapStyle.mapWrapper}>
                    <MapView
                        style={[mapStyle.map, expanded && mapStyle.mapExpanded]}
                        initialRegion={region}
                    >
                        {memoizedMarkers}
                        <Marker pinColor={'blue'} coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
                    </MapView>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToMyLocation} style={mapStyle.locationBtn}>
                    <Text style={mapStyle.locationText}>📍 My location</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const mapStyle = StyleSheet.create(
    {
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
            backgroundColor: policeColors.primary,
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
            color: policeColors.primary,
            fontWeight: '600',
        },
        backButton: {
            position: 'absolute',
            top: 70,
            left: 16,
            zIndex: 100,
        },
    }
)