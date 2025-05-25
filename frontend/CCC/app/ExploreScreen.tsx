import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppColor from '../constants/AppColor';
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

const SOURCES = [
    { title: 'Cluj24', url: 'https://cluj24.ro' },
    { title: 'Ziua de Cluj', url: 'https://ziuadecj.ro' },
    { title: 'Monitorul de Cluj', url: 'https://monitorulcj.ro' },
    { title: 'Stiri de Cluj', url: 'https://stiridecluj.ro' },
];

export default function ExploreScreen() {
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        const loadHistory = async () => {
            const storedUser = await AsyncStorage.getItem('userData');
            const user = storedUser ? JSON.parse(storedUser) : null;
            if (!user?.username) return;
            const key = `history-${user.username}`;
            const storedHistory = await AsyncStorage.getItem(key);
            if (storedHistory) setHistory(JSON.parse(storedHistory));
        };
        loadHistory();
    }, []);

    const handleVisit = async (title: string, url: string) => {
        const storedUser = await AsyncStorage.getItem('userData');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (!user?.username) return;
        const key = `history-${user.username}`;
        const storedHistory = await AsyncStorage.getItem(key);
        let historyArray = storedHistory ? JSON.parse(storedHistory) : [];
        if (!historyArray.includes(title)) historyArray.unshift(title);
        if (historyArray.length > 5) historyArray = historyArray.slice(0, 5);
        await AsyncStorage.setItem(key, JSON.stringify(historyArray));
        setHistory(historyArray);
        Linking.openURL(url);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={AppColor.primary} />
            </TouchableOpacity>
            <Text style={styles.header}>📰 Alege-ți sursa de știri din Cluj</Text>
            {SOURCES.map((source, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.card}
                    onPress={() => handleVisit(source.title, source.url)}
                >
                    <Text style={styles.cardText}>{source.title}</Text>
                </TouchableOpacity>


            ))}

            {history.length > 0 && (
                <View style={styles.historyBox}>
                    <Text style={styles.historyTitle}>🕓 Istoric Accesări</Text>
                    {history.map((item, i) => (
                        <Text key={i} style={styles.historyItem}>• {item}</Text>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: AppColor.background,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: '700',
        color: AppColor.primary,
        marginBottom: 25,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
        width: '100%',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    historyBox: {
        backgroundColor: '#eee',
        padding: 15,
        borderRadius: 12,
        marginTop: 30,
        width: '100%',
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#444',
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    historyItem: {
        fontSize: 14,
        color: '#333',
        marginBottom: 3,
    },
});