import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SalubritateScreen() {
    return (
        <View style={[styles.container, { backgroundColor: '#27ae60' }]}> {/* Verde salubritate */}
            <Text style={[styles.title, { fontFamily: 'Courier New' }]}>Salubritate</Text>
            <Text style={styles.subtitle}>Probleme de curățenie și colectare</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        color: 'white',
        marginBottom: 10,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16,
        color: '#f1f2f6',
        textAlign: 'center'
    },
});