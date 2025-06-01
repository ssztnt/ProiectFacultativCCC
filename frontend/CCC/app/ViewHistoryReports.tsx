// 📁 app/user/ViewHistoryReports.tsx (actualizat)
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
import {LinearGradient} from "expo-linear-gradient";
import { IssueItem } from '@/components/IssueItem';
import Colors from "@/app/organ/constants/Colors";

interface Issue {
    id: number;
    title: string;
    description: string;
    status: string;
    location: string,
    imageUrl?: string;
    createdAt: string;
}

const colors = Colors;
const PAGE_SIZE = 3;

export default function ViewHistoryReports() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [visibleIssues, setVisibleIssues] = useState<Issue[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

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
        fetchReports();
    }, []);

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
                <Text style={styles.header}>Istoricul Rapoartelor 📋</Text>

                <View style={styles.statsCard}>
                    <Text style={styles.statsTitle}>Rapoartele Tale</Text>
                    <Text style={styles.statsText}>📊 {issues.length} rapoarte trimise</Text>
                    <Text style={styles.statsText}>🎯 Urmărește progresul problemelor raportate</Text>
                </View>

                {loading ? (
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color={AppColor.primary} />
                        <Text style={styles.loadingText}>Se încarcă rapoartele... 🔄</Text>
                    </View>
                ) : visibleIssues.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>Niciun raport găsit 🤷‍♂️</Text>
                        <Text style={styles.emptyText}>Nu aveți încă rapoarte trimise. Începeți să raportați probleme din comunitate!</Text>
                        <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/ReportIssueScreen')}>
                            <Text style={styles.quickText}>🚨 Raportează o problemă acum</Text>
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

            {/* Modal pentru detalii (păstrăm modalul original pentru detalii) */}
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
                                    source={{ uri: selectedIssue.imageUrl }}
                                    style={styles.modalImage}
                                />
                            )}

                            <View style={styles.modalDescCard}>
                                <Text style={styles.modalDescTitle}>Descriere:</Text>
                                <Text style={styles.modalDescription}>{selectedIssue?.description}</Text>
                            </View>

                            <View style={styles.modalDateCard}>
                                <Text style={styles.modalDate}>
                                    📅 Creat la: {new Date(selectedIssue?.createdAt || '').toLocaleDateString('ro-RO')}
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
        paddingBottom: 120,
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