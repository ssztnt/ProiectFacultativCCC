import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Alert, Image, KeyboardAvoidingView, Platform, FlatList
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import AppColor from '../constants/AppColor';
import { IPaddress } from '@/constants/NetworkConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ReportIssueScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(null);
    const [locationText, setLocationText] = useState('');
    const [image, setImage] = useState<{ uri: string } | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Garbage', value: 'GARBAGE' },
        { label: 'Broken Road', value: 'BROKEN_ROAD' },
        { label: 'Air Pollution', value: 'AIR_POLLUTION' },
        { label: 'Water Leak', value: 'WATER_LEAK' },
        { label: 'Noise', value: 'NOISE' },
        { label: 'Fire', value: 'FIRE' },
        { label: 'Other', value: 'OTHER' },
    ]);

    const router = useRouter();

    const fetchLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Location permission is required to attach coordinates.');
            return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLatitude(loc.coords.latitude);
        setLongitude(loc.coords.longitude);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selected = result.assets[0];
            setImage({
                uri: selected.uri,
                name: selected.fileName || 'photo.jpg',
                type: selected.type || 'image/jpeg',
            } as any);

            await fetchLocation(); // Atașează automat locația
        }
    };

    const handleSubmit = async () => {
        if (!title || !description || !category || !locationText || !image || !latitude || !longitude) {
            Alert.alert('Please fill all required fields.');
            return;
        }

        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'You must be logged in.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('location', locationText);
        formData.append('latitude', String(latitude));
        formData.append('longitude', String(longitude));
        formData.append('image', {
            uri: image.uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
        } as any);

        try {
            const response = await fetch(`${IPaddress}/api/issues/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                Alert.alert('Success', 'Issue submitted successfully!');
                setTitle('');
                setDescription('');
                setCategory(null);
                setLocationText('');
                setImage(null);
                setLatitude(null);
                setLongitude(null);
                router.replace('/HomeScreen');
            } else {
                const err = await response.text();
                Alert.alert('Failed', err);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not submit issue.');
        }
    };

    const renderForm = () => (
        <View style={styles.card}>
            <Text style={styles.header}>Report a Problem</Text>

            <Text style={styles.label}>Title *</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <Text style={styles.label}>Description *</Text>
            <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} multiline />

            <Text style={styles.label}>Category *</Text>
            <DropDownPicker
                open={open}
                value={category}
                items={items}
                setOpen={setOpen}
                setValue={setCategory}
                setItems={setItems}
                placeholder="Select a category"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                maxHeight={300}
            />

            <Text style={styles.label}>Location *</Text>
            <TextInput style={styles.input} value={locationText} onChangeText={setLocationText} placeholder="Strada, cartier..." />

            <Text style={styles.label}>Image *</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                <Text style={styles.imagePickerText}>Choose Image</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: AppColor.background }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={AppColor.primary} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={[{ key: 'form' }]}
                    renderItem={renderForm}
                    keyExtractor={(item) => item.key}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: AppColor.background }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <FlatList
                    data={[{ key: 'form' }]}
                    renderItem={renderForm}
                    keyExtractor={(item) => item.key}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: AppColor.background,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        color: AppColor.primary,
        textAlign: 'center',
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 12,
        color: '#444',
    },
    input: {
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        padding: 12,
        marginTop: 6,
    },
    dropdown: {
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        marginTop: 6,
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    imagePicker: {
        backgroundColor: '#eee',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    imagePickerText: {
        color: '#333',
        fontWeight: '600',
    },
    preview: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 10,
    },
    submitButton: {
        backgroundColor: AppColor.primary,
        marginTop: 30,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    backButton: {
        marginRight: 10,
    }
});