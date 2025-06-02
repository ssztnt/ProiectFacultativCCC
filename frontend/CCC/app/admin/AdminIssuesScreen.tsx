import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, Animated, Image, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IPaddress } from "@/constants/NetworkConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppColor from '@/constants/AppColor';

const { width, height } = Dimensions.get('window');

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
    OPEN: { icon: '🚨', label: 'OPEN', color: '#e74c3c' },
    IN_PROGRESS: { icon: '🔄', label: 'IN-PROGRESS', color: '#f39c12' },
    RESOLVED: { icon: '✅', label: 'RESOLVED', color: '#2ecc71' },
};

export default function AdminIssuesScreen() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [newStatus, setNewStatus] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<string | undefined>();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const modalScaleAnim = useRef(new Animated.Value(0.8)).current;

    const fetchIssues = async () => {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${IPaddress}/api/issues`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setIssues(data);
        setLoading(false);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
            }),
        ]).start();
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const updateStatus = async () => {
        if (!selectedIssue) return;
        const token = await AsyncStorage.getItem('token');
        await fetch(`${IPaddress}/api/issues/${selectedIssue.id}/status`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus }),
        });
        setIssues(prev =>
            prev.map(i => i.id === selectedIssue.id ? { ...i, status: newStatus } : i)
        );
        setModalVisible(false);
    };

    const openStatusModal = (issue: Issue) => {
        setSelectedIssue(issue);
        setNewStatus(issue.status);
        setModalVisible(true);
        Animated.spring(modalScaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const renderItem = ({ item }: { item: Issue }) => (
        <TouchableOpacity style={localStyles.card} onPress={() => openStatusModal(item)}>
            <Text style={localStyles.title}>{item.title}</Text>
            <Text style={localStyles.description}>{item.description}</Text>
            <Text style={localStyles.meta}>Status: {item.status}</Text>
            {item.imageUrl && (
                <TouchableOpacity onPress={() => {
                    setSelectedImage(item.imageUrl);
                    setImageModalVisible(true);
                }}>
                    <Image
                        source={{ uri: `${IPaddress}/uploads/issue-pictures/${item.imageUrl}` }}
                        style={localStyles.image}
                    />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    return (

        <View style={{ flex: 1, backgroundColor: AppColor.background }}>
            {/* Header */}

            <View style={localStyles.header}>
                <Text style={localStyles.headerTitle}>📋 View all reports</Text>
                <Text style={localStyles.headerSubtitle}>Full incident list reported by users</Text>
            </View>

            {/* Issue List */}
            <FlatList
                data={issues}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
            />

            {/* Status Modal */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={localStyles.modalOverlay}>
                    <Animated.View style={[localStyles.modalContainer, { transform: [{ scale: modalScaleAnim }] }]}>
                        <Text style={localStyles.modalTitle}>Update Status</Text>
                        {Object.entries(statusConfig).map(([key, val]) => (
                            <TouchableOpacity
                                key={key}
                                style={[
                                    localStyles.statusOption,
                                    newStatus === key && { backgroundColor: val.color }
                                ]}
                                onPress={() => setNewStatus(key)}
                            >
                                <Text style={localStyles.statusOptionText}>{val.icon} {val.label}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={localStyles.confirmButton} onPress={updateStatus}>
                            <Text style={{ color: '#fff', fontWeight: '700' }}>💾 Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={{ marginTop: 10, color: '#aaa' }}>Cancel</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>

            {/* Image Modal */}
            <Modal visible={imageModalVisible} transparent animationType="fade">
                <TouchableOpacity style={localStyles.imageOverlay} onPress={() => setImageModalVisible(false)}>
                    {selectedImage && (
                        <Image
                            source={{ uri: `${IPaddress}/uploads/issue-pictures/${selectedImage}` }}
                            style={{ width, height, resizeMode: 'contain' }}
                        />
                    )}
                </TouchableOpacity>
            </Modal>
        </View>


    );
}

const localStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 4,
    },
    meta: {
        fontSize: 12,
        color: '#888',
        marginBottom: 10,
    },
    image: {
        height: 180,
        borderRadius: 12,
        width: '100%',
        marginTop: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#00000080',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        width: '85%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 16,
    },
    statusOption: {
        padding: 12,
        backgroundColor: '#f0f0f0',
        width: '100%',
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
    },
    statusOptionText: {
        fontSize: 14,
        fontWeight: '600',
    },
    confirmButton: {
        backgroundColor: '#1e824c',
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 12,
        marginTop: 10,
    },
    imageOverlay: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70, // ⬅️ schimbă de la 40 la 70 sau chiar 80 dacă ai notch mare
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#2c3e50',
        textAlign: 'center',
    },

    headerSubtitle: {
        fontSize: 13,
        color: '#6c7a89',
        fontWeight: '500',
        marginTop: 4,
        textAlign: 'center',
    },
});