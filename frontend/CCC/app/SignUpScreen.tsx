import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
} from 'react-native';
import { IPaddress } from '@/constants/NetworkConfig';
import AppColor from '../constants/AppColor';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignUp = async () => {
        if (!name || !surname || !username || !email || !password) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        try {
            const response = await fetch(`${IPaddress}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstname: name,
                    lastname: surname,
                    username,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Account created successfully!');
                setName('');
                setSurname('');
                setUsername('');
                setEmail('');
                setPassword('');
                router.replace('/');
            } else {
                const errorData = await response.json().catch(() => ({}));
                Alert.alert('Signup Failed', errorData?.message || 'Something went wrong.');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not connect to the server.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.wrapper}
            >
                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                    <Image
                        source={require('../assets/images/logocircular.png')} // Your circular Earth logo
                        style={styles.logo}
                    />

                    <Text style={styles.title}>Create Account</Text>

                    <TextInput
                        placeholder="First Name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholderTextColor="#999"
                    />
                    <TextInput
                        placeholder="Last Name"
                        value={surname}
                        onChangeText={setSurname}
                        style={styles.input}
                        placeholderTextColor="#999"
                    />
                    <TextInput
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                        placeholderTextColor="#999"
                    />
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
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

                    <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
                        <Text style={styles.registerText}>Sign Up</Text>
                    </TouchableOpacity>

                    <View style={styles.bottomText}>
                        <Text style={styles.grayText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.replace('/LoginScreen')}>
                            <Text style={styles.loginNow}> Log in</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: AppColor.background,
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    logo: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    registerButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
        marginBottom: 25,
    },
    registerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomText: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    grayText: {
        fontSize: 14,
        color: '#777',
    },
    loginNow: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '600',
    },
});
