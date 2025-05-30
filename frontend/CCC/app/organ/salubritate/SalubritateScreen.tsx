import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PompieriScreen() {
    return (
        <View style={[styles.container, { backgroundColor: '#c0392b' }]}> {/* Roșu pompieri */}
            <Text style={[styles.title, { fontFamily: 'Georgia' }]}>Pompieri</Text>
            <Text style={styles.subtitle}>Situații de urgență și intervenții</Text>
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