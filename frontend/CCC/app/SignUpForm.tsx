import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import {IPaddress} from "@/constants/NetworkConfig";

export default function SignupForm() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        if (!name || !surname || !username || !email || !password) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        try {
            console.log('Starting signup request...');
            const response = await fetch(`${IPaddress}/api/auth/signup`, { // <-- Fixed endpoint!
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname: name,
                    lastname: surname,
                    username: username,
                    email: email,
                    password: password,
                }),
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                Alert.alert('Success', 'Account created successfully!');
                setName('');
                setSurname('');
                setUsername('');
                setEmail('');
                setPassword('');
            } else {
                let errorMessage = 'Something went wrong.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData?.message || errorMessage;
                    console.log('Signup failed. Server says:', errorData);
                } catch (jsonError) {
                    console.log('Failed to parse error response as JSON.');
                }
                Alert.alert('Signup Failed', errorMessage);
            }
        } catch (error) {
            console.error('Signup error:', error);
            Alert.alert('Error', 'Could not connect to the server.');
        }
    };

    return (
        <View>
            <TextInput placeholder="Name" placeholderTextColor="#aaa" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Surname" placeholderTextColor="#aaa" value={surname} onChangeText={setSurname} style={styles.input} />
            <TextInput placeholder="Username" placeholderTextColor="#aaa" value={username} onChangeText={setUsername} style={styles.input} />
            <TextInput placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} style={styles.input} />
            <TextInput placeholder="Password" placeholderTextColor="#aaa" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

            <TouchableOpacity style={styles.mainButton} onPress={handleSignUp}>
                <Text style={styles.mainButtonText}>Sign Up</Text>
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