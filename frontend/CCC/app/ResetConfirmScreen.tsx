// app/ResetConfirmScreen.tsx
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { IPaddress } from '../constants/NetworkConfig';

export default function ResetConfirmScreen() {
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleConfirmReset = async () => {
        if (!password) return Alert.alert('Completează noua parolă.');

        const token = await SecureStore.getItemAsync('reset_token');
        if (!token) return Alert.alert('Token lipsă. Reîncearcă procesul.');

        try {
            const response = await fetch(`${IPaddress}/api/password-reset/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `token=${token}&newPassword=${encodeURIComponent(password)}`,
            });

            if (response.ok) {
                Alert.alert('Succes', 'Parola a fost resetată.');
                router.replace('/LoginScreen');
            } else {
                const err = await response.text();
                Alert.alert('Eroare', err || 'Token invalid.');
            }
        } catch (err) {
            Alert.alert('Eroare', 'Nu s-a putut conecta la server.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Confirmare Resetare</Text>
            <TextInput
                placeholder="Noua parolă"
                secureTextEntry
                placeholderTextColor="#999"
                style={styles.input}
                onChangeText={setPassword}
                value={password}
            />
            <TouchableOpacity style={styles.button} onPress={handleConfirmReset}>
                <Text style={styles.buttonText}>Resetează parola</Text>
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
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});