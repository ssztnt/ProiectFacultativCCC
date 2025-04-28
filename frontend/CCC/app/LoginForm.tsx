import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { IPaddress } from '../constants/NetworkConfig';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');



    const handleLogin = async () => {
        try {
            console.log('Starting login request...');

            const response = await fetch(`${IPaddress}/api/auth/login`, {
                method: 'POST',
                headers: {
                    responseType: 'text',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const token = await response.text();  // <<<<< notice: .text(), not .json()
                console.log('Login success! Token:', token);
                alert('Login Successful!');
            } else {
                console.log('Login failed. Status:', response.status);
                alert('Login Failed! Check your username and password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Error connecting to backend.');
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <TouchableOpacity style={styles.mainButton} onPress={handleLogin}>
                <Text style={styles.mainButtonText}>Log In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 15,
    },
    mainButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
    },
    mainButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});