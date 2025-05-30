import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function PolitieSettingsScreen() {
    const handleLogout = async () => {
        await AsyncStorage.clear();
        router.replace('/LoginScreen');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Setări Poliție</Text>
            <Button title="Logout" onPress={handleLogout} color="#c0392b" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ecf0f1', padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#0a3d62', marginBottom: 20 },
});
