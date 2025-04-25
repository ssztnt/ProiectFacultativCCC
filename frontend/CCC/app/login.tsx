import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
            />

            <Text style={styles.title}>Sign in to your{'\n'}Account</Text>

            <Text style={styles.subtitle}>
                Don’t have an account? <Text style={styles.signUp}>Sign Up</Text>
            </Text>

            {/* Email Field */}
            <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.icon} />
                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                />
            </View>

            {/* Password Field */}
            <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.icon} />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color="#aaa"
                        style={styles.iconRight}
                    />
                </TouchableOpacity>
            </View>

            {/* Forgot password */}
            <TouchableOpacity>
                <Text style={styles.forgot}>Forgot Your Password ?</Text>
            </TouchableOpacity>

            {/* Log in button */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0D16', // Dark background
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        color: '#aaa',
        marginBottom: 25,
    },
    signUp: {
        color: '#3B82F6',
        fontWeight: '600',
    },
    inputWrapper: {
        width: '100%',
        backgroundColor: '#181B2D',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    icon: {
        marginRight: 10,
    },
    iconRight: {
        marginLeft: 'auto',
    },
    input: {
        flex: 1,
        color: '#fff',
        height: 50,
    },
    forgot: {
        alignSelf: 'flex-end',
        color: '#aaa',
        marginBottom: 25,
        textDecorationLine: 'underline',
    },
    button: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 60,
        width: '100%',
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});