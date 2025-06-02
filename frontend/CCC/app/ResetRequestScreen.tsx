import { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Animated
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { IPaddress } from '@/constants/NetworkConfig';
import {Ionicons} from "@expo/vector-icons";

export default function ResetRequestScreen() {
    const [email, setEmail] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const router = useRouter();

    const animateIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start();
    };

    const handleResetRequest = async () => {
        if (!email || !email.includes('@')) {
            return Alert.alert('Please enter a valid email.');
        }

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
                Alert.alert('Success', 'Reset link sent!');
                router.replace('/ResetConfirmScreen');
            } else {
                Alert.alert('Error', resultText || 'Email not found.');
            }
        } catch (error) {
            Alert.alert('Server error', 'Please try again later.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            onLayout={animateIn}
        >
            <TouchableOpacity onPress={() => router.replace('/LoginScreen')} style={styles.backButton}>
                <Ionicons name="arrow-back" size={26} color="#237F52" />
            </TouchableOpacity>

            <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                <Ionicons name="lock-closed-outline" size={70} color="#237F52" style={styles.lockIcon} />
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>Enter your email to receive a reset link.</Text>
            </Animated.View>

            <TextInput
                placeholder="Your email address"
                placeholderTextColor="#999"
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />

            <TouchableOpacity style={styles.button} onPress={handleResetRequest}>
                <Text style={styles.buttonText}>Send reset link</Text>
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