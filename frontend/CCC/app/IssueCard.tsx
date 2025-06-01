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
    onVote?: (
        id: string,
        upVotes: number,
        downVotes: number,
        userVote: 'UPVOTE' | 'DOWNVOTE' | null
    ) => void;
}

export default function IssueCard({ issue, onVote }: IssueCardProps) {
    const baseUrl = IPaddress;
    const [upVotes, setUpVotes] = useState(0);
    const [downVotes, setDownVotes] = useState(0);
    const [userVote, setUserVote] = useState<'UPVOTE' | 'DOWNVOTE' | null>(issue.userVote ?? null);

    useEffect(() => {
        setUserVote(issue.userVote ?? null);
    }, [issue.userVote]);

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) return;

                const [upRes, downRes] = await Promise.all([
                    fetch(`${baseUrl}/api/votes/${issue.id}/upvotes`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${baseUrl}/api/votes/${issue.id}/downvotes`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                if (upRes.ok && downRes.ok) {
                    setUpVotes(await upRes.json());
                    setDownVotes(await downRes.json());
                }
            } catch (err) {
                console.error('[fetchVotes] Error:', err);
            }
        };

        fetchVotes();
    }, [issue.id]);

    console.log(`[IssueCard] Constructed image URL: ${IPaddress}/uploads/issue-pictures/${issue.imageUrl}`);

    const voteApiCall = async (type: 'UPVOTE' | 'DOWNVOTE') => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Eroare', 'Nu ești autentificat.');
            return null;
        }

        const url = `${baseUrl}/api/votes/${issue.id}?upvote=${type === 'UPVOTE'}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return { success: response.ok, status: response.status, body: await response.text() };
    };

    const updateVoteState = (type: 'UPVOTE' | 'DOWNVOTE') => {
        const isSameVote = userVote === type;

        const newUpVotes = type === 'UPVOTE'
            ? isSameVote ? upVotes - 1 : upVotes + 1 + (userVote === 'DOWNVOTE' ? -1 : 0)
            : upVotes - (userVote === 'UPVOTE' ? 1 : 0);

        const newDownVotes = type === 'DOWNVOTE'
            ? isSameVote ? downVotes - 1 : downVotes + 1 + (userVote === 'UPVOTE' ? -1 : 0)
            : downVotes - (userVote === 'DOWNVOTE' ? 1 : 0);

        setUpVotes(Math.max(newUpVotes, 0));
        setDownVotes(Math.max(newDownVotes, 0));
        setUserVote(isSameVote ? null : type);
        onVote?.(issue.id, Math.max(newUpVotes, 0), Math.max(newDownVotes, 0), isSameVote ? null : type);
    };

    const handleVote = async (direction: 'up' | 'down') => {
        const type = direction === 'up' ? 'UPVOTE' : 'DOWNVOTE';
        try {
            const result = await voteApiCall(type);
            if (!result) return;

            console.log(`[handleVote] Response ${result.status}: ${result.body}`);
            if (result.success) {
                updateVoteState(type);
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
            {issue.imageUrl && (
                <Image source={{ uri: `${IPaddress}/uploads/issue-pictures/${issue.imageUrl}` }} style={styles.image} />
            )}
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
