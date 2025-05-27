import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native';
import AppColor from '@/constants/AppColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPaddress } from '@/constants/NetworkConfig';

interface Issue {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
}

export default function AdminScreen() {
    const [issues, setIssues] = useState<Issue[]>([]);

    const fetchIssues = async () => {
        try {
            const response = await fetch(`${IPaddress}/api/issues`);
            if (response.ok) {
                const data = await response.json();
                setIssues(data);
            }
        } catch (error) {
            console.error('Failed to fetch issues:', error);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const renderItem = ({ item }: { item: Issue }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.meta}>Category: {item.category}</Text>
            <Text style={styles.meta}>Status: {item.status}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>All Reported Issues</Text>
            <FlatList
                data={issues}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.tabBar}>
                <Pressable style={styles.tabButton} onPress={() => {}}>
                    <Ionicons name="list" size={24} color={AppColor.primary} />
                    <Text style={styles.tabLabel}>Issues</Text>
                </Pressable>
                <Pressable style={styles.tabButton} onPress={() => {}}>
                    <Ionicons name="send" size={24} color="#444" />
                    <Text style={styles.tabLabel}>Dispatch</Text>
                </Pressable>
                <Pressable style={styles.tabButton} onPress={() => {}}>
                    <Ionicons name="settings" size={24} color="#444" />
                    <Text style={styles.tabLabel}>Settings</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColor.background,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        color: AppColor.primary,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        marginBottom: 6,
        color: '#444',
    },
    meta: {
        fontSize: 12,
        color: '#888',
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 70,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -3 },
        shadowRadius: 6,
        elevation: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    tabButton: {
        alignItems: 'center',
    },
    tabLabel: {
        fontSize: 12,
        color: '#444',
        marginTop: 4,
    },
});