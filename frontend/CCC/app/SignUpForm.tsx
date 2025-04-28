import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SignupForm() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View>
            <TextInput placeholder="Name" placeholderTextColor="#aaa" value={name} onChangeText={setName} style={styles.input} />
            <TextInput placeholder="Surname" placeholderTextColor="#aaa" value={surname} onChangeText={setSurname} style={styles.input} />
            <TextInput placeholder="Username" placeholderTextColor="#aaa" value={username} onChangeText={setUsername} style={styles.input} />
            <TextInput placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} style={styles.input} />
            <TextInput placeholder="Password" placeholderTextColor="#aaa" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

            <TouchableOpacity style={styles.mainButton}>
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