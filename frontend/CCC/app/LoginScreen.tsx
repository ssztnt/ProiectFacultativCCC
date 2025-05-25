import { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IPaddress } from '../constants/NetworkConfig';
import AppColor from '../constants/AppColor';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const shakeRef = useRef<any>(null);
    const confettiRef = useRef(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            shakeRef.current?.shake(800);
            alert('Please enter both username and password.');
            return;
        }

        try {
            const response = await fetch(`${IPaddress}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                const user = data.user;

                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('userData', JSON.stringify(user));

                setShowConfetti(true);
                setTimeout(() => {
                    router.replace({
                        pathname: '/WelcomeScreen',
                        params: { username: user.username },
                    });
                }, 1500);
            } else {
                shakeRef.current?.shake(800);
                const err = await response.text();
                alert(`Login Failed! ${err}`);
            }
        } catch (error) {
            console.error(error);
            alert('Error connecting to backend.');
        }
    };

    const openLink = (url: string) => {
        Linking.openURL(url).catch(() => {
            alert('Failed to open link');
        });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Animatable.View ref={shakeRef} style={{ width: '100%' }}>
                    <Text style={styles.welcome}>Welcome back, eco-hero! 🌿</Text>

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

                    <TouchableOpacity onPress={() => router.push('/ResetRequestScreen')}>
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

                    <Text style={styles.continueText}>Contact us </Text>

                    <View style={styles.socialIcons}>
                        <TouchableOpacity onPress={() => openLink('https://www.instagram.com/mrbeast/')}>
                            <FontAwesome name="instagram" size={28} color={AppColor.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openLink('https://github.com/ssztnt')}>
                            <FontAwesome name="github" size={28} color={AppColor.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openLink('https://www.linkedin.com/in/dan-gaspar-926b892b6/?originalSubdomain=ro')}>
                            <FontAwesome name="linkedin" size={28} color={AppColor.primary} />
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
                {showConfetti && (
                    <ConfettiCannon count={80} origin={{ x: 200, y: 300 }} fadeOut autoStart explosionSpeed={350} />
                )}
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
        fontSize: 22,
        fontWeight: 'bold',       // schimbă stilul
        fontStyle: 'italic',      // opțional: adaugă italic
        color: '#111',
        marginBottom: 30,
        textAlign: 'center',
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
        color: AppColor.primary,
        marginBottom: 25,
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: AppColor.primary,
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
        color: AppColor.primary,
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