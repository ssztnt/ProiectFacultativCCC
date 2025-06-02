import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IPaddress } from '@/constants/NetworkConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    reportCount: number;
}

export default function AdminManagerScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${IPaddress}/api/users/admin`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.warn('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const renderUser = ({ item }: { item: User }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <Ionicons name="person-circle-outline" size={40} color="#237F52" />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
                    <Text style={styles.username}>@{item.username}</Text>
                </View>
            </View>
            <Text style={styles.email}>📧 {item.email}</Text>
            <Text style={styles.reports}>📝 Reports submitted: {item.reportCount}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>👥 All Users</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#237F52" />
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderUser}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    username: {
        fontSize: 12,
        color: '#4B5563',
    },
    email: {
        fontSize: 13,
        color: '#374151',
        marginBottom: 6,
    },
    reports: {
        fontSize: 13,
        color: '#374151',
    },
});