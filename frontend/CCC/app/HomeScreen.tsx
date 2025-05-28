import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import AppColor from '@/constants/AppColor';
import {router} from "expo-router";

export default function HomeScreen() {
    const [region, setRegion] = useState<Region>({
        latitude: 46.7712,         // Cluj-Napoca
        longitude: 23.6236,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const [expanded, setExpanded] = useState(false);

    const goToMyLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permisiunea pentru locație a fost refuzată.');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🗺️ Cluj-Napoca Map</Text>

            <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/MainMenuScreen')}>
                <Text style={styles.backText}>← </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.mapWrapper}>
                <MapView
                    style={[styles.map, expanded && styles.mapExpanded]}
                    region={region}
                >
                    <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
                </MapView>
            </TouchableOpacity>

            <TouchableOpacity onPress={goToMyLocation} style={styles.locationBtn}>
                <Text style={styles.locationText}>📍 Locația mea</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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