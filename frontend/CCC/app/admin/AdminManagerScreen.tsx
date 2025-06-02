import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, Modal} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IPaddress } from '@/constants/NetworkConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppColor from "@/constants/AppColor";

interface User {
    id: number;
    firstname: string;
    lastname: string;
    profilePictureUrl: string;
    email: string;
    username: string;
}

export default function AdminManagerScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<any>(null);
    const [issueCounts, setIssueCounts] = useState<{ [key: number]: number }>({});

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const deleteUser = async () => {
        if (!selectedUser) return;
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${IPaddress}/api/users/${selectedUser.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
            setModalVisible(false);
            setSelectedUser(null);
        } else {
            alert('Delete failed');
        }
    };

    useEffect(() => {
        users.forEach(async (user) => {
            const res = await fetch(`${IPaddress}/api/issues/issue-count/${user.id}`);
            const count = await res.json();
            setIssueCounts(prev => ({ ...prev, [user.id]: count }));
        });
    }, [users]);

    useEffect(() => {
        const loadUser = async () => {
            const stored = await AsyncStorage.getItem('userData');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        };
        loadUser();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${IPaddress}/api/users/admin`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.warn('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const renderUser = ({ item }: { item: User }) => (
        <TouchableOpacity onPress={() => {
            setSelectedUser(item);
            setModalVisible(true);
        }}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>{item.firstname} {item.lastname}</Text>
                        <Text style={styles.username}>@{item.username}</Text>
                    </View>
                    <Image
                        source={
                            item.profilePictureUrl
                                ? { uri: `${IPaddress}/uploads/profile-pictures/${item.profilePictureUrl}` }
                                : require('@/assets/images/default-profile-picture.jpg') // sau calea corectă relativă
                        }
                        style={styles.profileImage}
                    />
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="mail-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{item.email}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="document-text-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>Reports submitted: {issueCounts[item.id] ?? '...'}</Text>
                </View>

                {/* Modal Delete */}
                <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Delete user?</Text>
                            <Text style={{ marginBottom: 20 }}>
                                Are you sure you want to delete <Text style={{ fontWeight: '700' }}>{selectedUser?.firstname} {selectedUser?.lastname}</Text>?
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                <TouchableOpacity onPress={() => {
                                    setModalVisible(false);
                                    setSelectedUser(null);
                                }} style={styles.cancelButton}>
                                    <Text style={{ color: '#444' }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={deleteUser} style={styles.deleteButton}>
                                    <Text style={{ color: '#fff', fontWeight: '700' }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            <Text style={styles.title}>👥 All Users</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#237F52" />
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderUser}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    nameContainer: {
        flexDirection: 'column',
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        paddingBottom: 3,
    },
    username: {
        fontSize: 12,
        color: '#4B5563',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    detailText: {
        marginLeft: 6,
        fontSize: 13,
        color: '#374151',
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: AppColor.primary,
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
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: '#ddd',
        borderRadius: 10,
    },
    deleteButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: '#e74c3c',
        borderRadius: 10,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ccc',
    },

});