import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IPaddress } from '@/constants/NetworkConfig';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IssueCardProps {
    issue: {
        id: string;
        title: string;
        description: string;
        category: string;
        status: string;
        location: string;
        imageUrl: string;
        userVote?: 'UPVOTE' | 'DOWNVOTE' | null;
    };
    onVote?: (id: string, upVotes: number, downVotes: number, userVote: 'UPVOTE' | 'DOWNVOTE' | null) => void;
}

export default function IssueCard({ issue, onVote }: IssueCardProps) {
    const baseUrl = IPaddress;
    // Initialize votes with 0, vor fi încărcate cu fetch
    const [upVotes, setUpVotes] = useState(0);
    const [downVotes, setDownVotes] = useState(0);
    const [userVote, setUserVote] = useState<'UPVOTE' | 'DOWNVOTE' | null>(issue.userVote ?? null);

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    console.warn('[fetchVotes] No token found');
                    return;
                }

                console.log(`[fetchVotes] Fetching votes for issue ${issue.id}...`);
                const upRes = await fetch(`${baseUrl}/api/votes/${issue.id}/upvotes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const downRes = await fetch(`${baseUrl}/api/votes/${issue.id}/downvotes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (upRes.ok && downRes.ok) {
                    const upCount = await upRes.json();
                    const downCount = await downRes.json();
                    setUpVotes(upCount);
                    setDownVotes(downCount);
                    console.log(`[fetchVotes] Received: up=${upCount}, down=${downCount}`);
                } else {
                    console.warn(`[fetchVotes] Failed to fetch votes. upRes.ok=${upRes.ok}, downRes.ok=${downRes.ok}`);
                }
            } catch (error) {
                console.error('[fetchVotes] Error:', error);
            }
        };

        fetchVotes();
    }, [issue.id]);

    const handleVote = async (type: 'up' | 'down') => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Eroare', 'Nu ești autentificat.');
                return;
            }

            const upvote = type === 'up';
            const url = `${baseUrl}/api/votes/${issue.id}?upvote=${upvote}`;
            console.log(`[handleVote] Sending vote: ${type.toUpperCase()} -> ${url}`);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const responseText = await response.text(); // Capturam textul oricum
            console.log(`[handleVote] Response status: ${response.status}, body: ${responseText}`);

            if (response.ok) {
                console.log(`[handleVote] Vote sent successfully. Previous vote: ${userVote}`);

                if (userVote === (type === 'up' ? 'UPVOTE' : 'DOWNVOTE')) {
                    console.log(`[handleVote] Unvoting ${type}`);
                    if (type === 'up') {
                        setUpVotes(v => Math.max(v - 1, 0));
                    } else {
                        setDownVotes(v => Math.max(v - 1, 0));
                    }
                    setUserVote(null);
                    onVote?.(issue.id,
                        type === 'up' ? upVotes - 1 : upVotes,
                        type === 'down' ? downVotes - 1 : downVotes,
                        null);
                } else {
                    if (userVote === null) {
                        console.log(`[handleVote] New vote: ${type}`);
                        if (type === 'up') {
                            setUpVotes(v => v + 1);
                        } else {
                            setDownVotes(v => v + 1);
                        }
                    } else {
                        console.log(`[handleVote] Changing vote from ${userVote} to ${type}`);
                        if (type === 'up') {
                            setUpVotes(v => v + 1);
                            setDownVotes(v => (v > 0 ? v - 1 : 0));
                        } else {
                            setDownVotes(v => v + 1);
                            setUpVotes(v => (v > 0 ? v - 1 : 0));
                        }
                    }
                    setUserVote(type === 'up' ? 'UPVOTE' : 'DOWNVOTE');
                    onVote?.(
                        issue.id,
                        type === 'up' ? upVotes + 1 : upVotes,
                        type === 'down' ? downVotes + 1 : downVotes,
                        type === 'up' ? 'UPVOTE' : 'DOWNVOTE'
                    );
                }
            } else {
                Alert.alert('Eroare', 'Nu s-a putut trimite votul.');
            }
        } catch (error) {
            console.error('[handleVote] Error:', error);
            Alert.alert('Eroare', 'A apărut o eroare la votare.');
        }
    };


    return (
        <View style={styles.card}>
            {issue.imageUrl ? (
                <Image source={{ uri: baseUrl + issue.imageUrl }} style={styles.image} />
            ) : null}
            <View style={styles.details}>
                <Text style={styles.title}>{issue.title}</Text>
                <Text style={styles.description}>{issue.description}</Text>
                <Text style={styles.info}>Category: {issue.category}</Text>
                <Text style={styles.info}>Status: {issue.status}</Text>
                <Text style={styles.info}>Location: {issue.location}</Text>

                <View style={styles.voteRow}>
                    <TouchableOpacity onPress={() => handleVote('up')} style={styles.voteButton}>
                        <Ionicons
                            name={userVote === 'UPVOTE' ? "thumbs-up" : "thumbs-up-outline"}
                            size={20}
                            color="#237F52"
                        />
                        <Text style={styles.voteText}>{upVotes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleVote('down')} style={styles.voteButton}>
                        <Ionicons
                            name={userVote === 'DOWNVOTE' ? "thumbs-down" : "thumbs-down-outline"}
                            size={20}
                            color="#B00020"
                        />
                        <Text style={styles.voteText}>{downVotes}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    details: {
        paddingHorizontal: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    info: {
        fontSize: 14,
        color: '#444',
        marginBottom: 5,
    },
    voteRow: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'flex-start',
        gap: 20,
    },
    voteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    voteText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#333',
    },
});
