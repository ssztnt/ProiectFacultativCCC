import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
    const router = useRouter();

    const handleLogin = () => {
        // Do your login logic here
        alert('Logged in (simulated)');
        // Later: router.replace('/home') or tabs etc.
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome 🌿</Text>
            <Text style={styles.subtitle}>Log in to continue</Text>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B2E1D',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#a5d6a7',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#3BB273',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});