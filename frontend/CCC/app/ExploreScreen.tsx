import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppColor from '../constants/AppColor';
import IssueCard from '../app/IssueCard';
import { connectWebSocket, disconnectWebSocket } from '@/services/WebSocket';
import { IPaddress } from "@/constants/NetworkConfig";
import AppLayout from "@/components/AppLayout";
import { Image,} from 'react-native';

const SOURCES = [
    { title: 'Cluj24', url: 'https://cluj24.ro' },
    { title: 'Ziua de Cluj', url: 'https://ziuadecj.ro' },
    { title: 'Monitorul de Cluj', url: 'https://monitorulcj.ro' },
    { title: 'Stiri de Cluj', url: 'https://stiridecluj.ro' },
];

export default function ExploreScreen() {
    const [history, setHistory] = useState<string[]>([]);
    const [issues, setIssues] = useState<any[]>([]);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);


    const [sortBy, setSortBy] = useState<'upvotes' | 'status'>('upvotes'); // State to track sorting method

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
                    console.warn('[fetchIssues] No token found.');
                    return;
                }

                // Dynamically select the endpoint based on the current sorting method
                const endpoint =
                    sortBy === 'upvotes'
                        ? `${IPaddress}/api/issues/sorted-by-upvotes`
                        : `${IPaddress}/api/issues/sorted-by-status`;

                const response = await fetch(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();

                    const issuesWithVotes = await Promise.all(
                        data.map(async (issue: any) => {
                            const voteRes = await fetch(`${IPaddress}/api/votes/${issue.id}/user`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            if (voteRes.ok) {
                                const userVote = await voteRes.json();
                                return { ...issue, userVote };
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

        return () => {
            disconnectWebSocket(); // Disconnect WebSocket on unmount
        };
    }, [sortBy]); // Re-fetch issues whenever the sorting method changes

    const toggleSort = () => {
        // Toggle between "upvotes" and "status" sorting
        setSortBy(prevSortBy => (prevSortBy === 'upvotes' ? 'status' : 'upvotes'));
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

    return (
        <AppLayout>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>📰 Pick your media source</Text>
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
                        <Text style={styles.historyTitle}>🕓 Access History</Text>
                        {history.map((item, i) => (
                            <Text key={i} style={styles.historyItem}>• {item}</Text>
                        ))}
                    </View>
                )}

                <View style={styles.issuesHeader}>
                    <Text style={styles.issuesTitle}>📋 Issues</Text>
                    <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
                        <Text style={styles.sortButtonText}>
                            {sortBy === 'upvotes' ? 'By Status' : 'By Upvotes'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.issuesBox}>
                    {issues.map((issue) => (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                            onVote={handleVoteUpdate}
                            onPressImage={(imageUrl) => {
                                setSelectedImageUrl(imageUrl);
                                setImageModalVisible(true);
                            }}
                        />
                    ))}
                </View>
            </ScrollView>
            <Modal
                visible={imageModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setImageModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setImageModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        {selectedImageUrl && (
                            <Image source={{ uri: selectedImageUrl }} style={styles.fullImage} />
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
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
        width: '48%',
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
    issuesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sortButton: {
        backgroundColor: AppColor.primary,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: 'flex-end',
        marginTop: 16, // Increased space above the button
    },
    sortButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    issuesTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#444',
        marginTop: 18,
    },
    historyItem: {
        fontSize: 14,
        color: '#333',
        marginBottom: 3,
    },
    issuesBox: {
        marginTop: 10,
        width: '100%',
        marginBottom: 70,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
        maxHeight: '90%',
        maxWidth: '90%',
    },
    fullImage: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        borderRadius: 10,
    },
});