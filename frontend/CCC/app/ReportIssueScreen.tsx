import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    FlatList
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import AppColor from '../constants/AppColor';
import { IPaddress } from '@/constants/NetworkConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportIssueScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(null);
    const [location, setLocation] = useState('');
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Garbage', value: 'GARBAGE' },
        { label: 'Broken Road', value: 'BROKEN_ROAD' },
        { label: 'Air Pollution', value: 'AIR_POLLUTION' },
        { label: 'Water Leak', value: 'WATER_LEAK' },
        { label: 'Noise', value: 'NOISE' },
        { label: 'Other', value: 'OTHER' },
    ]);

    const router = useRouter();

    const handleSubmit = async () => {
        if (!title || !description || !category || !location) {
            Alert.alert('Please fill all required fields.');
            return;
        }

        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'You must be logged in.');
            return;
        }

        const issuePayload = { title, description, category, location };

        try {
            const response = await fetch(`${IPaddress}/api/issues/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(issuePayload),
            });

            if (response.ok) {
                Alert.alert('Success', 'Issue submitted successfully!');
                setTitle('');
                setDescription('');
                setCategory(null);
                setLocation('');
                router.replace('/MainMenuScreen');
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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Report a Problem</Text>

            <Text style={styles.label}>Title *</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <Text style={styles.label}>Description *</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={description}
                onChangeText={setDescription}
                multiline
            />

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
            <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Strada, cartier..."
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: AppColor.background }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <FlatList
                    data={[{ key: 'form' }]} // Single item to render the form
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
    backButton: {
        position: 'absolute',
        top: 12,
        left: 20,
        zIndex: 10,
    },
    backButtonText: {
        color: AppColor.primary,
        fontSize: 16,
        fontWeight: '600',
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
});