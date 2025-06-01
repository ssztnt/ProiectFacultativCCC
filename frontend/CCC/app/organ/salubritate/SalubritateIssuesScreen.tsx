import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IPaddress } from "@/constants/NetworkConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from '../constants/Colors';
import { styles } from '../constants/issuesScreenStyle';

const { width } = Dimensions.get('window');

const colors = Colors;
const sanitationColors = colors.sanitation;

interface Issue {
    id: number;
    title: string;
    description: string;
    location: string;
    status: string;
    imageUrl?: string;
    createdAt: string;
}

const statusConfig = {
    OPEN: {
        color: colors.open.status,
        gradient: colors.open.gradient,
        icon: '♻️',
        label: 'OPEN'
    },
    IN_PROGRESS: {
        color: colors.in_progress.status,
        gradient: colors.in_progress.gradient,
        icon: '🚛',
        label: 'IN-PROGRESS'
    },
    RESOLVED: {
        color: colors.resolved.status,
        gradient: colors.resolved.gradient,
        icon: '✅',
        label: 'DONE'
    }
};

export default function SalubritateIssuesScreen() {
    const sanitationColors = Colors.sanitation;
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [newStatus, setNewStatus] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const modalScaleAnim = useRef(new Animated.Value(0.8)).current;

    const fetchReports = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${IPaddress}/api/issues/sanitation`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setIssues(data);

                // Entrance animation
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        tension: 50,
                        friction: 8,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        } catch (err) {
            console.error('Failed to fetch reports:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const openStatusModal = (issue: Issue) => {
        setSelectedIssue(issue);
        setNewStatus(issue.status);
        setModalVisible(true);

        // Modal entrance animation
        Animated.spring(modalScaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(modalScaleAnim, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
        });
    };

    const updateStatus = async () => {
        if (!selectedIssue) return;

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${IPaddress}/api/issues/${selectedIssue.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setIssues((prev) =>
                    prev.map((issue) =>
                        issue.id === selectedIssue.id ? { ...issue, status: newStatus } : issue
                    )
                );
                closeModal();
            } else {
                console.error('Failed to update status');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const renderIssueItem = ({ item, index }: { item: Issue, index: number }) => {
        const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.OPEN;

        // @ts-ignore
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
                            })
                        }]
                    }
                ]}
            >
                <TouchableOpacity
                    onPress={() => openStatusModal(item)}
                    activeOpacity={0.9}
                    style={styles.issueTouchable}
                >
                    <LinearGradient
                        colors={colors.issue.background as [string, string]}
                        style={styles.issueCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        {/* Priority Indicator */}
                        <View style={[styles.priorityBar, { backgroundColor: config.color }]} />

                        {/* Header */}
                        <View style={styles.issueHeader}>
                            <View style={styles.issueTitleSection}>
                                <Text style={styles.issueIcon}>{config.icon}</Text>
                                <View style={styles.issueTitleContainer}>
                                    <Text style={styles.issueTitle} numberOfLines={2}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.issueId}>#{item.id}</Text>
                                </View>
                            </View>

                            <LinearGradient
                                colors={config.gradient as [string, string]}
                                style={styles.statusBadge}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.statusBadgeText}>
                                    {config.label}
                                </Text>
                            </LinearGradient>
                        </View>

                        {/* Location */}
                        <View style={styles.locationRow}>
                            <Text style={styles.locationIcon}>📍</Text>
                            <Text style={styles.locationText} numberOfLines={1}>
                                {item.location}
                            </Text>
                        </View>

                        {/* Description */}
                        <Text style={styles.descriptionText} numberOfLines={3}>
                            {item.description}
                        </Text>

                        {/* Footer */}
                        <View style={styles.issueFooter}>
                            <Text style={styles.timestampText}>
                                🕒 {new Date(item.createdAt).toLocaleDateString('ro-RO', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            </Text>
                            <Text style={styles.tapHint}>Tap to update →</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient
                    colors={[sanitationColors.background, '#f8f9fa']}
                    style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.loadingText}>🔄 Loading incidents...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[sanitationColors.background, '#f8f9fa']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Header */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                <Text style={styles.title}>🚨 Active Incidents</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{issues.length}</Text>
                        <Text style={styles.statLabel}>Total Cases</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: colors.open.status }]}>
                            {issues.filter(i => i.status === 'OPEN').length}
                        </Text>
                        <Text style={styles.statLabel}>Urgent</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: colors.resolved.status }]}>
                            {issues.filter(i => i.status === 'RESOLVED').length}
                        </Text>
                        <Text style={styles.statLabel}>Resolved</Text>
                    </View>
                </View>
            </Animated.View>

            {/* Issues List */}
            <FlatList
                data={issues}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderIssueItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />

            {/* Status Update Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.modalContainer,
                            {
                                transform: [{ scale: modalScaleAnim }]
                            }
                        ]}
                    >
                        <LinearGradient
                            colors={['#ffffff', '#f8f9fa']}
                            style={styles.modalContent}
                        >
                            <Text style={styles.modalTitle}>
                                🔄 Update Status
                            </Text>
                            <Text style={styles.modalSubtitle}>
                                {selectedIssue?.title}
                            </Text>

                            <View style={styles.statusOptions}>
                                {Object.entries(statusConfig).map(([status, config]) => (
                                    <TouchableOpacity
                                        key={status}
                                        style={styles.statusOptionTouchable}
                                        onPress={() => setNewStatus(status)}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={newStatus === status ? config.gradient as [string, string] : ['#f8f9fa', '#ffffff'] as [string, string]}
                                            style={[
                                                styles.statusOption,
                                                newStatus === status && styles.statusOptionSelected
                                            ]}
                                        >
                                            <Text style={styles.statusOptionIcon}>
                                                {config.icon}
                                            </Text>
                                            <Text style={[
                                                styles.statusOptionText,
                                                { color: newStatus === status ? '#fff' : '#333' }
                                            ]}>
                                                {config.label}
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={closeModal}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.saveButtonTouchable}
                                    onPress={updateStatus}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={sanitationColors.gradient as [string, string]}
                                        style={styles.saveButton}
                                    >
                                        <Text style={styles.saveButtonText}>
                                            💾 Save Changes
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}