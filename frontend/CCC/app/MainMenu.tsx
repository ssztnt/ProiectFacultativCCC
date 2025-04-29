import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {router} from "expo-router";

export default function MainMenuScreen() {
    const [username, setUsername] = useState('User'); // You can pass real username later

    useEffect(() => {
        // Fetch username from storage, context, or backend here if needed
        // setUsername('Rares');
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome, {username}! 🌿</Text>

            <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="camera-outline" size={24} color="white" />
                <Text style={styles.menuButtonText}>Report Problem</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="map-outline" size={24} color="white" />
                <Text style={styles.menuButtonText}>View Reports on Map</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="list-outline" size={24} color="white" />
                <Text style={styles.menuButtonText}>My Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="newspaper-outline" size={24} color="white" />
                <Text style={styles.menuButtonText}>Environmental News</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/AuthScreen')}>
                <Ionicons name="log-out-outline" size={20} color="#237F52" />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF5E1',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    welcomeText: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 30,
        color: '#237F52',
        textAlign: 'center',
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#237F52',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        width: '100%',
        marginBottom: 15,
    },
    menuButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
    },
    logoutButtonText: {
        marginLeft: 5,
        color: '#237F52',
        fontSize: 16,
        fontWeight: '600',
    },
});