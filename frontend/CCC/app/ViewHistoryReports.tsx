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
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPaddress } from '@/constants/NetworkConfig';
import AppColor from '@/constants/AppColor';

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

    const renderItem = ({ item }: { item: Issue }) => (
        <TouchableOpacity style={styles.card} onPress={() => setSelectedIssue(item)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Istoricul Rapoartelor</Text>

            {loading ? <ActivityIndicator size="large" color={AppColor.primary} /> : (
                <FlatList
                    data={visibleIssues}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                />
            )}

            <Modal
                visible={selectedIssue !== null}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedIssue(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedIssue?.title}</Text>
                        {selectedIssue?.imageUrl && (
                            <Image
                                source={{ uri: selectedIssue.imageUrl }}
                                style={styles.modalImage}
                            />
                        )}
                        <Text>{selectedIssue?.description}</Text>
                        <Text style={styles.status}>Status: {selectedIssue?.status}</Text>
                        <TouchableOpacity onPress={() => setSelectedIssue(null)}>
                            <Text style={styles.closeButton}>Închide</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColor.background,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: AppColor.primary,
        marginBottom: 16,
        textAlign: 'center'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50'
    },
    description: {
        fontSize: 14,
        color: '#7f8c8d'
    },
    status: {
        fontSize: 12,
        color: '#2980b9',
        marginTop: 4
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
        borderRadius: 10,
        padding: 20,
        width: '100%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#e74c3c'
    },
    modalImage: {
        width: Dimensions.get('window').width - 64,
        height: 200,
        borderRadius: 10,
        marginBottom: 12,
        resizeMode: 'cover'
    },
    closeButton: {
        color: '#c0392b',
        textAlign: 'center',
        marginTop: 16,
        fontWeight: '600'
    }
});
