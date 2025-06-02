import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../app/organ/constants/Colors';
import { styles } from '@/app/organ/constants/issuesScreenStyle';
import { Ionicons } from '@expo/vector-icons';
import { IPaddress } from '@/constants/NetworkConfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from 'react-native';

interface Issue {
    id: number;
    title: string;
    description: string;
    location: string;
    status: string;
    imageUrl?: string;
    createdAt: string;
}

interface IssueItemProps {
    item: Issue;
    index: number;
    onPress: (issue: Issue) => void;
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const colors = Colors;

const statusConfig = {
    OPEN: {
        color: colors.open.status,
        gradient: colors.open.gradient,
        icon: '🚨',
        label: 'OPEN',
    },
    IN_PROGRESS: {
        color: colors.in_progress.status,
        gradient: colors.in_progress.gradient,
        icon: '🚔',
        label: 'IN PROGRESS',
    },
    RESOLVED: {
        color: colors.resolved.status,
        gradient: colors.resolved.gradient,
        icon: '✅',
        label: 'RESOLVED',
    },
};

export const IssueItem: React.FC<IssueItemProps> = ({
                                                        item,
                                                        index,
                                                        onPress,
                                                        fadeAnim,
                                                        slideAnim,
                                                    }) => {
    const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.OPEN;
    const [upVotes, setUpVotes] = useState(0);
    const [downVotes, setDownVotes] = useState(0);
    const [userVote, setUserVote] = useState<'UPVOTE' | 'DOWNVOTE' | null>(null);
    const baseUrl = IPaddress;

    useEffect(() => {}, [item.id]);

    return (
        <Animated.View
            style={[
                styles.issueWrapper,
                {
                    opacity: fadeAnim,
                    transform: [{
                        translateY: slideAnim.interpolate({
                            inputRange: [0, 30],
                            outputRange: [0, 30 + (index * 10)],
                        }),
                    }],
                },
            ]}
        >
            <TouchableOpacity
                onPress={() => onPress(item)}
                activeOpacity={0.9}
                style={styles.issueTouchable}
            >
                <LinearGradient
                    colors={colors.issue.background as [string, string]}
                    style={styles.issueCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={[styles.priorityBar, { backgroundColor: config.color }]} />
                    <View style={styles.issueHeader}>
                        <View style={styles.issueTitleSection}>
                            <Text style={styles.issueIcon}>{config.icon}</Text>
                            <View style={styles.issueTitleContainer}>
                                <Text style={styles.issueTitle} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.issueId}>#{item.id}</Text>
                            </View>
                        </View>
                        <LinearGradient
                            colors={config.gradient as [string, string]}
                            style={styles.statusBadge}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.statusBadgeText}>{config.label}</Text>
                        </LinearGradient>
                    </View>

                    {item.imageUrl && (
                        <Image
                            source={{ uri: `${baseUrl}/uploads/issue-pictures/${item.imageUrl}` }}
                            style={styles.issueImage}
                        />
                    )}

                    <View style={styles.locationRow}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
                    </View>

                    <Text style={styles.descriptionText} numberOfLines={3}>{item.description}</Text>

                    <View style={styles.issueFooter}>
                        <Text style={styles.timestampText}>
                            🕒 {new Date(item.createdAt).toLocaleDateString('ro-RO', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                        </Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};