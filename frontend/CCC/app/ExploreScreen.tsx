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
import { router } from "expo-router";
import IssueCard from '../app/IssueCard';
import { Ionicons } from "@expo/vector-icons";
import { connectWebSocket, disconnectWebSocket } from '../services/WebSocket';
import {IPaddress} from "@/constants/NetworkConfig";
import AppLayout from "@/components/AppLayout";

const SOURCES = [
    { title: 'Cluj24', url: 'https://cluj24.ro' },
    { title: 'Ziua de Cluj', url: 'https://ziuadecj.ro' },
    { title: 'Monitorul de Cluj', url: 'https://monitorulcj.ro' },
    { title: 'Stiri de Cluj', url: 'https://stiridecluj.ro' },
];

export default function ExploreScreen() {
    const [history, setHistory] = useState<string[]>([]);
    const [issues, setIssues] = useState<any[]>([]);

    useEffect(() => {
        const initializeData = async () => {
            await loadHistory();
            await fetchIssues();
        };

        const loadHistory = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('userData');
                const user = storedUser ? JSON.parse(storedUser) : null;
                if (!user?.username) return;
                const key = `history-${user.username}`;
                const storedHistory = await AsyncStorage.getItem(key);
                if (storedHistory) setHistory(JSON.parse(storedHistory));
            } catch (error) {
                console.error('Error loading history:', error);
            }
        };

        const fetchIssues = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    console.warn('[fetchIssues] No token found');
                    return;
                }

                const response = await fetch(`${IPaddress}/api/issues`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();

                    // Verifică votul utilizatorului pentru fiecare issue
                    const issuesWithVotes = await Promise.all(
                        data.map(async (issue: any) => {
                            const voteRes = await fetch(`${IPaddress}/api/votes/${issue.id}/user`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            if (voteRes.ok) {
                                const userVote = await voteRes.json();
                                return { ...issue, userVote }; // Adaugă `userVote` la issue
                            }
                            return { ...issue, userVote: null };
                        })
                    );

                    setIssues(issuesWithVotes);
                } else {
                    console.error('Failed to fetch issues:', response.status);
                }
            } catch (error) {
                console.error('Error fetching issues:', error);
            }
        };

        initializeData();

        // WebSocket connect: handle issue and vote updates
        connectWebSocket(
            (updatedIssue: any) => {
                if (updatedIssue.action === 'delete') {
                    setIssues(prevIssues => prevIssues.filter(issue => issue.id !== updatedIssue.data.id));
                } else {
                    setIssues(prevIssues => {
                        const index = prevIssues.findIndex(issue => issue.id === updatedIssue.data.id);
                        if (index !== -1) {
                            const newIssues = [...prevIssues];
                            newIssues[index] = updatedIssue.data;
                            return newIssues;
                        }
                        return [...prevIssues, updatedIssue.data];
                    });
                }
            }
        );

        // WebSocket disconnect on unmount
        return () => {
            disconnectWebSocket();
        };
    }, []);

    const fetchVotes = async (issueId: number) => {
        if (!issueId) {
            console.warn('[fetchVotes] Issue ID is undefined.');
            return;
        }
        try {
            const upRes = await fetch(`${IPaddress}/api/votes/upvotes/${issueId}`);
            const downRes = await fetch(`${IPaddress}/api/votes/downvotes/${issueId}`);
            if (upRes.ok && downRes.ok) {
                const upVotes = await upRes.json();
                const downVotes = await downRes.json();
                console.log(`[fetchVotes] Fetched votes for issue ${issueId}:`, { upVotes, downVotes });
            } else {
                console.warn('[fetchVotes] Failed to fetch votes. upRes.ok=', upRes.ok, 'downRes.ok=', downRes.ok);
            }
        } catch (error) {
            console.error('[fetchVotes] Error fetching votes:', error);
        }
    };

    const handleVoteUpdate = (
        id: string,
        newUpVotes: number,
        newDownVotes: number,
        userVote: 'UPVOTE' | 'DOWNVOTE' | null
    ) => {
        setIssues(prevIssues =>
            prevIssues.map(issue =>
                issue.id === id
                    ? { ...issue, upVotes: newUpVotes, downVotes: newDownVotes, userVote }
                    : issue
            )
        );
    };

    const handleVisit = async (title: string, url: string) => {
        try {
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
        } catch (error) {
            console.error('Error handling visit:', error);
        }
    };

    return (
        <AppLayout>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>📰 Alege-ți sursa de știri din Cluj</Text>
                <View style={styles.cardsContainer}>
                    {SOURCES.map((source, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.card}
                            onPress={() => handleVisit(source.title, source.url)}
                        >
                            <Text style={styles.cardText}>{source.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {history.length > 0 && (
                    <View style={styles.historyBox}>
                        <Text style={styles.historyTitle}>🕓 Istoric Accesări</Text>
                        {history.map((item, i) => (
                            <Text key={i} style={styles.historyItem}>• {item}</Text>
                        ))}
                    </View>
                )}

                <View style={styles.issuesBox}>
                    <Text style={styles.issuesTitle}>📋 Issues</Text>
                    {issues.map((issue) => (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                            onVote={handleVoteUpdate}
                        />
                    ))}
                </View>
            </ScrollView>
        </AppLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        padding: 20,
        backgroundColor: AppColor.background,
        flexGrow: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: AppColor.primary,
        textAlign: 'center',
        marginBottom: 20,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
        width: '48%', // Aproximativ jumătate din lățime
        alignItems: 'center',
    },
    cardText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
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
    backText: {
        fontSize: 30,
        color: AppColor.primary,
        fontWeight: '600',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
        zIndex: 10,
    },
    historyItem: {
        fontSize: 14,
        color: '#333',
        marginBottom: 3,
    },
    issuesBox: {
        marginTop: 30,
        width: '100%',
    },
    issuesTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#444',
    },
});