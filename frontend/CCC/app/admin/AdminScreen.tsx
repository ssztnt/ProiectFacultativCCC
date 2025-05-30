import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, SafeAreaView, Pressable,
    Modal, TouchableOpacity, Button
} from 'react-native';
import AppColor from '@/constants/AppColor';
import { Ionicons } from '@expo/vector-icons';
import { IPaddress } from '@/constants/NetworkConfig';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Issue {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
}

export default function AdminScreen() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    const fetchIssues = async () => {
        try {
            const response = await fetch(`${IPaddress}/api/issues`);
            if (response.ok) {
                const data = await response.json();
                setIssues(data);
            }
        } catch (error) {
            console.error('Failed to fetch issues:', error);
        }
    };

    const openIssue = (issue: Issue) => {
        setSelectedIssue(issue);
        setSelectedStatus(issue.status);
        setModalVisible(true);
    };

    const markAsStatus = async (issueId: number, status: string) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('[AUTH] Token JWT lipsă în AsyncStorage');
                return;
            }

            console.log(`[REQUEST] PUT /issues/${issueId}/status`);
            console.log('[PAYLOAD]', { status });
            console.log('[HEADER]', { Authorization: `Bearer ${token}` });

            const response = await fetch(`${IPaddress}/api/issues/${issueId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                console.log('[SUCCESS] Issue updated');
                setModalVisible(false);
                fetchIssues(); // reîncarcă lista
            } else {
                const errorText = await response.text();
                console.error('[FAILURE] Backend response not OK:', errorText);
            }
        } catch (error) {
            console.error('[ERROR] Network/logic error:', error);
        }
    };

    const renderItem = ({ item }: { item: Issue }) => (
        <TouchableOpacity style={styles.card} onPress={() => openIssue(item)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.meta}>Category: {item.category}</Text>
            <Text style={styles.meta}>Status: {item.status}</Text>
        </TouchableOpacity>
    );

    useEffect(() => {
        fetchIssues();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>All Reported Issues</Text>
            <FlatList
                data={issues}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.tabBar}>
                <Pressable style={styles.tabButton} onPress={() => {}}>
                    <Ionicons name="list" size={24} color={AppColor.primary} />
                    <Text style={styles.tabLabel}>Issues</Text>
                </Pressable>
                <Pressable style={styles.tabButton} onPress={() => {}}>
                    <Ionicons name="send" size={24} color="#444" />
                    <Text style={styles.tabLabel}>Dispatch</Text>
                </Pressable>
                <Pressable style={styles.tabButton} onPress={() => {}}>
                    <Ionicons name="settings" size={24} color="#444" />
                    <Text style={styles.tabLabel}>Settings</Text>
                </Pressable>
            </View>

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{selectedIssue?.title}</Text>
                        <Text style={styles.description}>{selectedIssue?.description}</Text>
                        <Text style={styles.meta}>Categorie: {selectedIssue?.category}</Text>
                        <Text style={styles.meta}>Status curent: {selectedIssue?.status}</Text>

                        <View style={{ marginVertical: 12, zIndex: 1000 }}>
                            <DropDownPicker
                                open={dropdownOpen}
                                value={selectedStatus}
                                items={[
                                    { label: 'OPEN', value: 'OPEN' },
                                    { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
                                ]}
                                setOpen={setDropdownOpen}
                                setValue={setSelectedStatus}
                                setItems={() => {}} // ignorăm
                                containerStyle={{ zIndex: 1000 }}
                            />
                        </View>

                        <Button title="Actualizează statusul" onPress={() => markAsStatus(selectedIssue!.id, selectedStatus)} />
                        <View style={{ height: 10 }} />
                        <Button title="Închide" onPress={() => setModalVisible(false)} color="#888" />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColor.background,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        color: AppColor.primary,
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        marginBottom: 6,
        color: '#444',
    },
    meta: {
        fontSize: 12,
        color: '#888',
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 70,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -3 },
        shadowRadius: 6,
        elevation: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    tabButton: {
        alignItems: 'center',
    },
    tabLabel: {
        fontSize: 12,
        color: '#444',
        marginTop: 4,
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
        maxWidth: 400,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});