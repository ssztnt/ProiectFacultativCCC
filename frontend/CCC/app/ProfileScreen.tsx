import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AppColor from '../constants/AppColor';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadUser = async () => {
            const stored = await AsyncStorage.getItem('userData');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        };
        loadUser();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#237F52" />
            </TouchableOpacity>

            {/* User Info */}
            <View style={styles.userCard}>
                <Ionicons name="person-circle-outline" size={64} color={AppColor.primary} />
                <Text style={styles.userName}>
                    {user ? `${user.firstname} ${user.lastname}` : 'Nume Prenume'}
                </Text>
                <Text style={styles.userTag}>
                    {user ? `@${user.username}` : '@username'}
                </Text>
            </View>

            {/* General Settings */}
            <Text style={styles.sectionTitle}>⚙️ General</Text>
            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Notificări Push</Text>
                <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
            </View>
            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Mod încerat (Dark Mode)</Text>
                <Switch value={darkModeEnabled} onValueChange={setDarkModeEnabled} />
            </View>

            {/* Securitate */}
            <Text style={styles.sectionTitle}>🔐 Securitate</Text>
            <TouchableOpacity style={styles.optionRow}>
                <Text style={styles.optionText}>Schimbă parola</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionRow}>
                <Text style={styles.optionText}>Schimbă emailul</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>

            {/* Legal */}
            <Text style={styles.sectionTitle}>📄 Legal</Text>
            <TouchableOpacity style={styles.optionRow}>
                <Text style={styles.optionText}>Termeni și condiții</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionRow}>
                <Text style={styles.optionText}>Politica de confidențialitate</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: AppColor.background,
        padding: 20,
        justifyContent: 'center',
    },
    userCard: {
        alignItems: 'center',
        marginBottom: 30,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 10,
        color: AppColor.primary,
    },
    userTag: {
        fontSize: 14,
        color: '#777',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginTop: 20,
        marginBottom: 10,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        backgroundColor: AppColor.primary,
        paddingVertical: 15,
        borderRadius: 10,
    },
    logoutText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
        zIndex: 10,
    },
});