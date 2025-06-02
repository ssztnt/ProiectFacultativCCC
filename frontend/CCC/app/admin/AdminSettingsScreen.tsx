import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminSettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⚙️ Admin Settings</Text>

            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Enable Notifications</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                />
            </View>

            <TouchableOpacity style={styles.optionRow}>
                <Text style={styles.optionText}>Terms & Conditions</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow}>
                <Text style={styles.optionText}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
        backgroundColor: '#f2f4f7',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        color: '#34495e',
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    settingText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#444',
    },
    optionRow: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
});