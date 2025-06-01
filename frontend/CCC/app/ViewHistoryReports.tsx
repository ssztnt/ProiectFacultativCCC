// 📁 app/user/ViewHistoryReports.tsx
import React, { useEffect, useState } from 'react';
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
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPaddress } from '@/constants/NetworkConfig';
import AppColor from '@/constants/AppColor';
import {router} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import AppLayout from '@/components/AppLayout'; // Import layout-ul

interface Issue {
    id: number;
    title: string;
    description: string;
    status: string;
    imageUrl?: string;
    createdAt: string;
}

const PAGE_SIZE = 3;

export default function ViewHistoryReports() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [visibleIssues, setVisibleIssues] = useState<Issue[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

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

    const renderItem = ({ item }: { item: Issue }) => (
        <TouchableOpacity style={styles.card} onPress={() => setSelectedIssue(item)}>
            <View style={styles.cardHeader}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.statusEmoji}>{getStatusEmoji(item.status)}</Text>
            </View>
            <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.status}>Status: {item.status}</Text>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString('ro-RO')}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <AppLayout>
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={AppColor.primary} />
                </TouchableOpacity>

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
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        scrollEnabled={false}
                    />
                )}
            </ScrollView>

            <Modal
                visible={selectedIssue !== null}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedIssue(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedIssue?.title}</Text>
                                <TouchableOpacity onPress={() => setSelectedIssue(null)}>
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
        paddingBottom: 120, // Spațiu pentru footer
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 16,
        padding: 10,
        zIndex: 10,
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        flex: 1,
    },
    statusEmoji: {
        fontSize: 20,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    status: {
        fontSize: 12,
        color: AppColor.primary,
        fontWeight: '500',
    },
    date: {
        fontSize: 12,
        color: '#666',
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