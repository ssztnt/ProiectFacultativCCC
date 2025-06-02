import { useState, useRef } from 'react';
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
    Linking
} from 'react-native';
import { IPaddress } from '@/constants/NetworkConfig';
import AppColor from '../constants/AppColor';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const shakeRef = useRef<any>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleSignUp = async () => {
        if (!name || !surname || !username || !email || !password) {
            shakeRef.current?.shake(800);
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
                setShowConfetti(true);
                Alert.alert('Success', 'Account created successfully!');
                setTimeout(() => {
                    setName('');
                    setSurname('');
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    router.replace('/');
                }, 1500);
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
                        source={require('../assets/images/logocircular.png')}
                        style={styles.logo}
                    />

                    <Text style={styles.welcome}>Create Account</Text>

                    <Animatable.View ref={shakeRef} style={{ width: '100%' }}>
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
                    </Animatable.View>

                    <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
                        <Text style={styles.registerText}>Sign Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.replace('/LoginScreen')} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={AppColor.primary} />
                    </TouchableOpacity>

                    <View style={styles.bottomText}>
                        <Text style={styles.grayText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.replace('/LoginScreen')}>
                            <Text style={styles.loginNow}> Log in</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.socialSection}>
                        <Text style={styles.grayText}>Follow us</Text>
                        <View style={styles.socialIcons}>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/mrbeast/')}>
                                <FontAwesome name="instagram" size={26} color={AppColor.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/ssztnt')}>
                                <FontAwesome name="github" size={26} color={AppColor.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/dan-gaspar-926b892b6')}>
                                <FontAwesome name="linkedin" size={26} color={AppColor.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {showConfetti && (
                        <ConfettiCannon
                            count={100}
                            origin={{ x: 200, y: 300 }}
                            fadeOut
                            explosionSpeed={350}
                            autoStart
                        />
                    )}
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
        color: AppColor.primary,
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
        backgroundColor: AppColor.primary,
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
        marginBottom: 25,
    },
    grayText: {
        fontSize: 14,
        color: '#777',
    },
    loginNow: {
        fontSize: 14,
        color: AppColor.primary,
        fontWeight: '600',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 20,
        zIndex: 10,
        padding: 10,
    },
    socialSection: {
        alignItems: 'center',
        marginTop: 40,
    },
    socialIcons: {
        flexDirection: 'row',
        gap: 30,
        marginTop: 10,
    },
    welcome: {
        fontSize: 22,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#111',
        marginBottom: 30,
        textAlign: 'center',
    },
});