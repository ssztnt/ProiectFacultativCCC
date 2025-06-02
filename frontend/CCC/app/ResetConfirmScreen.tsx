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
    Animated
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IPaddress } from '@/constants/NetworkConfig';

export default function ResetConfirmScreen() {
    const [password, setPassword] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const router = useRouter();

    const animateIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start();
    };

    const handlePasswordReset = async () => {
        if (!password || password.length < 6) {
            Alert.alert('Password must be at least 6 characters.');
            return;
        }

        const token = await SecureStore.getItemAsync('reset_token');
        if (!token) {
            Alert.alert('Error', 'Reset token not found.');
            return;
        }

        try {
            const response = await fetch(`${IPaddress}/api/password-reset/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(password)}`,
            });

            if (response.ok) {
                Alert.alert('Success', 'Password changed successfully.');
                router.replace('/LoginScreen');
            } else {
                const resultText = await response.text();
                Alert.alert('Error', resultText || 'Reset failed.');
            }
        } catch (error) {
            Alert.alert('Error', 'Server error.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            onLayout={animateIn}
        >
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={26} color="#237F52" />
            </TouchableOpacity>

            <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                <Ionicons name="key-outline" size={70} color="#237F52" style={styles.lockIcon} />
                <Text style={styles.title}>Confirm Reset</Text>
                <Text style={styles.subtitle}>Set your new password securely</Text>
            </Animated.View>

            <TextInput
                placeholder="New Password"
                secureTextEntry
                placeholderTextColor="#999"
                style={styles.input}
                onChangeText={setPassword}
                value={password}
            />

            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
        backgroundColor: '#DFF5E1',
    },
    lockIcon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#237F52',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#237F52',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
    },
});