// app/ResetRequestScreen.tsx
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { IPaddress } from '../constants/NetworkConfig';
import {Ionicons} from "@expo/vector-icons";

export default function ResetRequestScreen() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleResetRequest = async () => {
        if (!email) return Alert.alert('Completează emailul.');

        try {
            const response = await fetch(`${IPaddress}/api/password-reset/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `email=${encodeURIComponent(email)}`,
            });

            const resultText = await response.text();

            if (response.ok) {
                const token = resultText.split(':')[1].trim();
                await SecureStore.setItemAsync('reset_token', token);
                router.replace('/ResetConfirmScreen');
            } else {
                Alert.alert('Eroare', resultText || 'Email inexistent.');
            }
        } catch (error) {
            Alert.alert('Eroare', 'Serverul nu răspunde.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resetare Parolă</Text>
            <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
            />
            <TouchableOpacity style={styles.button} onPress={handleResetRequest}>
                <Text style={styles.buttonText}>Trimite codul</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#237F52" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#DFF5E1' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#237F52' },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#237F52',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,           // ajustează în funcție de status bar
        left: 20,
        padding: 10,
        zIndex: 10,
    },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});