import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IPaddress } from '@/constants/NetworkConfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';


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
        createdAt?: string;
    };
    onVote?: (
        id: string,
        upVotes: number,
        downVotes: number,
        userVote: 'UPVOTE' | 'DOWNVOTE' | null
    ) => void;
    onPressImage?: (imageUrl: string) => void;
}

export default function IssueCard({ issue, onVote, onPressImage }: IssueCardProps) {
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

    const getStatusConfig = (status: string) => {
        const normalizedStatus = status.toLowerCase().trim();

        if (normalizedStatus.includes('resolved')) {
            return {
                colors: ['#4CAF50', '#66BB6A'] as const,
                textColor: '#FFFFFF',
                icon: '✅',
                label: 'RESOLVED',
                borderColor: '#4CAF50'
            };
        } else if (normalizedStatus.includes('progress')) {
            return {
                colors: ['#FF9800', '#FFB74D'] as const,
                textColor: '#FFFFFF',
                icon: '🔄',
                label: 'IN PROGRESS',
                borderColor: '#FF9800'
            };
        } else {
            return {
                colors: ['#F44336', '#EF5350'] as const,
                textColor: '#FFFFFF',
                icon: '🚨',
                label: 'OPEN',
                borderColor: '#F44336'
            };
        }
    };

    const getCategoryIcon = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('strada') || cat.includes('drum')) return '🛣️';
        if (cat.includes('gunoi') || cat.includes('deșeu')) return '🗑️';
        if (cat.includes('parc') || cat.includes('verde')) return '🌳';
        if (cat.includes('iluminat') || cat.includes('lumină')) return '💡';
        if (cat.includes('apă') || cat.includes('canalizare')) return '💧';
        return '📋';
    };

    const statusConfig = getStatusConfig(issue.status);

    const voteApiCall = async (type: 'UPVOTE' | 'DOWNVOTE') => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'You are not authenticated.');
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
        let newUpVotes = upVotes;
        let newDownVotes = downVotes;
        let newUserVote = userVote;

        // daca apasa upvote
        if (type === 'UPVOTE') {
            if (userVote === 'UPVOTE') {
                newUpVotes = upVotes - 1;
                newUserVote = null;
            } else {
                if (userVote === 'DOWNVOTE') {
                    newDownVotes = downVotes - 1;
                }
                newUpVotes = upVotes + 1;
                newUserVote = 'UPVOTE';
            }
            // daca apasa downvote
        } else if (type === 'DOWNVOTE') {
            if (userVote === 'DOWNVOTE') {
                newDownVotes = downVotes - 1;
                newUserVote = null;
            } else {
                if (userVote === 'UPVOTE') {
                    newUpVotes = upVotes - 1;
                }
                newDownVotes = downVotes + 1;
                newUserVote = 'DOWNVOTE';
            }
        }

        setUpVotes(newUpVotes);
        setDownVotes(newDownVotes);
        setUserVote(newUserVote);

        onVote?.(
            issue.id,
            Math.max(newUpVotes, 0),
            Math.max(newDownVotes, 0),
            newUserVote
        );
    };

    const handleVote = async (direction: 'up' | 'down') => {
        const type = direction === 'up' ? 'UPVOTE' : 'DOWNVOTE';
        try {
            const result = await voteApiCall(type);
            if (!result) return;
            if (result.success) {
                updateVoteState(type);
            } else {
                Alert.alert('Error', 'Unable to send vote.');
            }
        } catch (error) {
            console.error('[handleVote] Error:', error);
            Alert.alert('Error', 'Error on voting.');
        }
    };

    return (
        <View style={[styles.card, { borderLeftColor: statusConfig.borderColor }]}>
            {/* Status Badge */}
            <View style={styles.statusContainer}>
                <LinearGradient
                    colors={statusConfig.colors}
                    style={styles.statusBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={[styles.statusIcon, { color: statusConfig.textColor }]}>
                        {statusConfig.icon}
                    </Text>
                    <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
                        {statusConfig.label}
                    </Text>
                </LinearGradient>
                <Text style={styles.issueId}>#{issue.id}</Text>
            </View>

            {/* Image */}
            {issue.imageUrl && (
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => onPressImage?.(`${IPaddress}/uploads/issue-pictures/${issue.imageUrl}`)}>
                        <Image
                            source={{ uri: `${IPaddress}/uploads/issue-pictures/${issue.imageUrl}` }}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.3)'] as const}
                        style={styles.imageOverlay}
                    />
                </View>
            )}

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{issue.title}</Text>
                <Text style={styles.description} numberOfLines={3}>{issue.description}</Text>

                {/* Category & Location */}
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoIcon}>{getCategoryIcon(issue.category)}</Text>
                        <Text style={styles.infoText}>{issue.category}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoIcon}>📍</Text>
                        <Text style={styles.infoText} numberOfLines={1}>{issue.location}</Text>
                    </View>
                </View>

                {/* Date */}
                {issue.createdAt && (
                    <View style={styles.dateRow}>
                        <Text style={styles.dateText}>
                            🕒 {new Date(issue.createdAt).toLocaleDateString('ro-RO', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        </Text>
                    </View>
                )}

                {/* Vote Section */}
                <View style={styles.voteSection}>
                    <View style={styles.voteRow}>
                        <TouchableOpacity
                            onPress={() => handleVote('up')}
                            style={[
                                styles.voteButton,
                                userVote === 'UPVOTE' && styles.voteButtonActive
                            ]}
                        >
                            <Ionicons
                                name={userVote === 'UPVOTE' ? "thumbs-up" : "thumbs-up-outline"}
                                size={20}
                                color={userVote === 'UPVOTE' ? "#FFFFFF" : "#4CAF50"}
                            />
                            <Text style={[
                                styles.voteText,
                                userVote === 'UPVOTE' && styles.voteTextActive
                            ]}>
                                {upVotes}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleVote('down')}
                            style={[
                                styles.voteButton,
                                userVote === 'DOWNVOTE' && styles.voteButtonActiveDown
                            ]}
                        >
                            <Ionicons
                                name={userVote === 'DOWNVOTE' ? "thumbs-down" : "thumbs-down-outline"}
                                size={20}
                                color={userVote === 'DOWNVOTE' ? "#FFFFFF" : "#F44336"}
                            />
                            <Text style={[
                                styles.voteText,
                                userVote === 'DOWNVOTE' && styles.voteTextActive
                            ]}>
                                {downVotes}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 5,
        borderLeftWidth: 4,
        overflow: 'hidden',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    statusIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    issueId: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    imageContainer: {
        position: 'relative',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
        lineHeight: 26,
    },
    description: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
        marginBottom: 16,
    },
    infoRow: {
        marginBottom: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        fontSize: 16,
        marginRight: 8,
        width: 20,
    },
    infoText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        flex: 1,
    },
    dateRow: {
        marginTop: 8,
        marginBottom: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    dateText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    voteSection: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 16,
    },
    voteRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    voteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        minWidth: 80,
        justifyContent: 'center',
    },
    voteButtonActive: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    voteButtonActiveDown: {
        backgroundColor: '#F44336',
        borderColor: '#F44336',
    },
    voteText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    voteTextActive: {
        color: '#FFFFFF',
    },
});