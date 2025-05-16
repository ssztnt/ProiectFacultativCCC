import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { IPaddress } from '../constants/NetworkConfig';
import AppColor from '../constants/AppColor';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }

        try {
            const response = await fetch(`${IPaddress}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    responseType: 'text',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const token = await response.text();
                alert('Login Successful!');
                router.replace({ pathname: '/MainMenu', params: { username } });
            } else {
                alert('Login Failed! Check your username and password.');
            }
        } catch (error) {
            alert('Error connecting to backend.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Text style={styles.welcome}>Welcome!</Text>

                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    placeholderTextColor="#999"
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#999"
                />

                <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Not a member?</Text>
                    <TouchableOpacity onPress={() => router.push('/SignUpScreen')}>
                        <Text style={styles.registerNow}> Register now</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.separator} />

                <Text style={styles.continueText}>Or continue with</Text>

                <View style={styles.socialIcons}>
                    <FontAwesome name="google" size={28} color="#DB4437" />
                    <FontAwesome name="apple" size={28} color="#000" />
                    <FontAwesome name="facebook" size={28} color="#4267B2" />
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColor.background,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    welcome: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 30,
        color: '#111',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        color: '#3B82F6',
        marginBottom: 25,
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    loginText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 25,
    },
    registerText: {
        color: '#555',
        fontSize: 14,
    },
    registerNow: {
        color: '#3B82F6',
        fontSize: 14,
        fontWeight: '600',
    },
    separator: {
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        marginVertical: 15,
    },
    continueText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#777',
        marginBottom: 15,
    },
    socialIcons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: 60,
    },
});