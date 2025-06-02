import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPaddress } from '@/constants/NetworkConfig';
import AppColor from '@/constants/AppColor';
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import AppLayout from '@/components/AppLayout';
import { IssueItem } from '@/components/IssueItem';
import { ResolvedIssueValue, OpenIssueValue } from "@/constants/Constants";
import { connectWebSocket, disconnectWebSocket } from '@/services/WebSocket';

interface Issue {
    id: number;
    title: string;
    description: string;
    status: string;
    location: string,
    imageUrl?: string;
    createdAt: string;
}
const PAGE_SIZE = 3;

export default function ViewHistoryReports() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [visibleIssues, setVisibleIssues] = useState<Issue[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [user, setUser] = useState<any>(null);


    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const fetchReports = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${IPaddress}/api/issues/my-reports`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setIssues(data);
                setVisibleIssues(data.slice(0, PAGE_SIZE));

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
        const loadUser = async () => {
            const stored = await AsyncStorage.getItem('userData');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        fetchReports();

        const handleWebSocketUpdate = (updatedIssue: any) => {
            setIssues(prevIssues => {
                if (updatedIssue.action === 'delete') {
                    const filtered = prevIssues.filter(issue => issue.id !== updatedIssue.data.id);
                    setVisibleIssues(filtered.slice(0, page * PAGE_SIZE)); // actualizează paginat
                    return filtered;
                } else {
                    const index = prevIssues.findIndex(issue => issue.id === updatedIssue.data.id);
                    let newIssues;
                    if (index !== -1) {
                        newIssues = [...prevIssues];
                        newIssues[index] = updatedIssue.data;
                    } else {
                        newIssues = [updatedIssue.data, ...prevIssues]; // sau push la final, depinde ce vrei
                    }
                    setVisibleIssues(newIssues.slice(0, page * PAGE_SIZE)); // actualizează paginat
                    return newIssues;
                }
            });
        };

        connectWebSocket(handleWebSocketUpdate);

        return () => {
            disconnectWebSocket();
        };
    }, [page]); // Observă că am pus page în deps pentru că folosim page când actualizăm visibleIssues



    const [userPoints, setUserPoints] = useState(0);
    const computePoints = (issues: Issue[]) => {
        return issues.reduce(
            (sum, i) => sum + (i.status === 'RESOLVED' ? ResolvedIssueValue : OpenIssueValue),
            0
        );
    };

    useEffect(() => {
        if (issues.length > 0) {
            setUserPoints(computePoints(issues));
        }
    }, [issues]);

    const loadMore = () => {
        const nextPage = page + 1;
        const start = (nextPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        setVisibleIssues(prev => [...prev, ...issues.slice(start, end)]);
        setPage(nextPage);
    };



    const getStatusEmoji = (status: string) => {
        switch (status.toLowerCase()) {
            case 'resolved': case 'rezolvat': return '✅';
            case 'pending': case 'in asteptare': return '⏳';
            case 'in progress': case 'in progres': return '🔄';
            default: return '📌';
        }
    };

    const openDetailModal = (issue: Issue) => {
        setSelectedIssue(issue);
        setModalVisible(true);
    };

    const renderIssueItem = ({ item, index }: { item: Issue, index: number }) => (
        <IssueItem
            item={item}
            index={index}
            onPress={openDetailModal}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
        />
    );

    return (
        <AppLayout>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.header}>Personal Reports History 📋</Text>

                <View style={styles.statsCard}>
                    <View style={{ flex: 7 }}>
                        <Text style={styles.statsTitle}>Your reports</Text>
                        <Text style={styles.statsText}>📊 {issues.length} reports sent</Text>
                        <Text style={styles.statsText}>🎯 Follow your progress right here!</Text>
                    </View>

                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={
                                user?.profilePictureUrl
                                    ? { uri: `${IPaddress}/uploads/profile-pictures/${user.profilePictureUrl}` }
                                    : undefined
                            }
                            style={{ width: 60, height: 60, borderRadius: 30, marginBottom: 4, backgroundColor: '#ccc' }}
                        />
                        <Text style={styles.statsText}>
                            {user?.firstname ?? 'User'}
                        </Text>
                        <Text style={styles.statsText}>{userPoints} Points</Text>
                    </View>
                </View>

                {loading ? (
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color={AppColor.primary} />
                        <Text style={styles.loadingText}>Reports loading... 🔄</Text>
                    </View>
                ) : visibleIssues.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>No reports found 🤷‍♂️</Text>
                        <Text style={styles.emptyText}>No reports sent. Start right now to help the community!</Text>
                        <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/ReportIssueScreen')}>
                            <Text style={styles.quickText}>🚨 Report a problem right now</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={visibleIssues}
                        renderItem={renderIssueItem}
                        keyExtractor={item => item.id.toString()}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        scrollEnabled={false}
                    />
                )}
            </ScrollView>


            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedIssue?.title}</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalStatusCard}>
                                <Text style={styles.modalStatusText}>
                                    {getStatusEmoji(selectedIssue?.status || '')} Status: {selectedIssue?.status}
                                </Text>
                            </View>

                            {selectedIssue?.imageUrl && (
                                <Image
                                    source={{ uri: `${IPaddress}/uploads/issue-pictures/${selectedIssue.imageUrl}` }}
                                    style={styles.modalImage}
                                />
                            )}

                            <View style={styles.modalDescCard}>
                                <Text style={styles.modalDescTitle}>Description:</Text>
                                <Text style={styles.modalDescription}>{selectedIssue?.description}</Text>
                            </View>

                            <View style={styles.modalDateCard}>
                                <Text style={styles.modalDate}>
                                    📅 Created at: {new Date(selectedIssue?.createdAt || '').toLocaleDateString('ro-RO')}
                                </Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </AppLayout>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    content: {
        paddingTop: 100,
        paddingHorizontal: 16,
        paddingBottom: 75,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: AppColor.primary,
        textAlign: 'center',
        marginBottom: 20,
    },
    statsCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 4,
        flexDirection: 'row',
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
    },
    statsText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    loadingCard: {
        backgroundColor: '#DFF6E3',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
        fontWeight: '500',
    },
    emptyCard: {
        backgroundColor: '#DFF6E3',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 20,
    },
    quickAction: {
        backgroundColor: '#FFD700',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    quickText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        flex: 1,
        marginRight: 16,
    },
    modalStatusCard: {
        backgroundColor: '#DFF6E3',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    modalStatusText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    modalImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
        resizeMode: 'cover',
    },
    modalDescCard: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: AppColor.primary,
    },
    modalDescTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 6,
    },
    modalDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    modalDateCard: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
    },
    modalDate: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
});