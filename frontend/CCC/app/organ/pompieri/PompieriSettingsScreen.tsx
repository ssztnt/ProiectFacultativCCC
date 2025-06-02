import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Alert,
    Switch,
    ScrollView,
    Image,
    Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as ImagePicker from "expo-image-picker";
import {IPaddress} from "@/constants/NetworkConfig";
import {Ionicons} from "@expo/vector-icons";
import Colors from '../constants/Colors';

const firefighterColors = Colors.firefighters;

type LegalModalType = 'terms' | 'privacy';

export default function PompieriSettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const [legalModalVisible, setLegalModalVisible] = useState(false);
    const [legalModalType, setLegalModalType] = useState<LegalModalType | null>(null);

    const openTerms = () => {
        setLegalModalType('terms');
        setLegalModalVisible(true);
    };

    const openPrivacy = () => {
        setLegalModalType('privacy');
        setLegalModalVisible(true);
    };

    const closeModal = () => {
        setLegalModalVisible(false);
        setLegalModalType(null);
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

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            const token = await AsyncStorage.getItem('token');
            const localUri = result.assets[0].uri;
            const filename = localUri.split('/').pop() || 'image.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            const formData = new FormData();
            formData.append('image', {
                uri: localUri,
                name: filename,
                type,
            } as any);

            try {
                const response = await fetch(`${IPaddress}/api/users/profile-picture`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                });

                if (response.ok) {
                    const newImageUrl = await response.text();
                    const updatedUser = { ...user, profilePictureUrl: newImageUrl };
                    setUser(updatedUser);
                    await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
                    Alert.alert('Success', 'Profile picture updated!');
                    setModalVisible(false);
                } else {
                    Alert.alert('Error', 'Failed to update profile picture.');
                }
            } catch (err) {
                Alert.alert('Error', 'Upload failed.');
            }
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Are you sure?',
            '',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.clear();
                        router.replace('/LoginScreen');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.userCard}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    {user?.profilePictureUrl ? (
                        <Image source={{ uri: `${IPaddress}/uploads/profile-pictures/${user.profilePictureUrl}` }} style={styles.avatar} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={80} color={Colors.firefighters.primary} />
                    )}
                </TouchableOpacity>
                <Text style={styles.userName}>{user ? `${user.firstname} ${user.lastname}` : 'Name Firstname'}</Text>
                <Text style={styles.userTag}>{user ? `@${user.username}` : '@username'}</Text>
            </View>

            <Text style={styles.sectionTitle}>⚙️ General</Text>
            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Push Notifications</Text>
                <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
            </View>

            <Text style={styles.sectionTitle}>🔐 Security</Text>
            <TouchableOpacity style={styles.optionRow} onPress={() => router.replace('/ResetRequestScreen')}>
                <Text style={styles.optionText}>Change password</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>📄 Legal</Text>
            <TouchableOpacity style={styles.optionRow} onPress={openTerms}>
                <Text style={styles.optionText}>Terms and conditions</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow} onPress={openPrivacy}>
                <Text style={styles.optionText}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {user?.profilePictureUrl && (
                            <Image source={{ uri: `${IPaddress}/uploads/profile-pictures/${user.profilePictureUrl}` }} style={styles.fullImage} resizeMode="cover" />
                        )}
                        <TouchableOpacity onPress={handleImagePick} style={styles.changeBtn}>
                            <Text style={styles.changeBtnText}>Change profile picture</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={{ marginTop: 10, color: '#888' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: firefighterColors.background,
        padding: 20,
        justifyContent: 'center',
    },
    userCard: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 8,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 10,
        color: Colors.firefighters.primary,
    },
    userTag: {
        fontSize: 14,
        color: '#777',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginTop: 20,
        marginBottom: 10,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        backgroundColor: Colors.firefighters.primary,
        paddingVertical: 15,
        borderRadius: 10,
    },
    logoutText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
        zIndex: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    fullImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: Colors.firefighters.primary,
    },
    changeBtn: {
        marginTop: 15,
        backgroundColor: Colors.firefighters.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    changeBtnText: {
        color: 'white',
        fontWeight: '600',
    },
});