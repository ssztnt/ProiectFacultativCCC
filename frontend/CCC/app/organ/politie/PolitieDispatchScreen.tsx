import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PolitieDispatchScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Trimite echipaj / Intervenție</Text>
            {/* TODO: Selectează problemă și marcheaz-o ca preluată */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ecf0f1', padding: 20 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#0a3d62' },
});
