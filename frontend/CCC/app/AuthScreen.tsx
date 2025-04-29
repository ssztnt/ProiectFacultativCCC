import { useState } from 'react';
import { Image } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,} from 'react-native';
import LoginForm from './LoginForm';
import SignupForm from './SignUpForm';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require('../assets/images/cleannclearcity_logo_3.png')}
                style={{ width: 100, height: 100, resizeMode: 'contain' }}
            />
            <Text style={styles.logo}>🌿 CleanNClearCity</Text>

            <Text style={styles.title}>Get Started now</Text>
            <Text style={styles.subtitle}>
                Create an account or log in to explore about our app
            </Text>

            {/* Switch Tabs */}
            <View style={styles.switchTabs}>
                <TouchableOpacity
                    style={[styles.tabButton, isLogin && styles.activeTab]}
                    onPress={() => setIsLogin(true)}
                >
                    <Text style={isLogin ? styles.activeTabText : styles.inactiveTabText}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, !isLogin && styles.activeTab]}
                    onPress={() => setIsLogin(false)}
                >
                    <Text style={!isLogin ? styles.activeTabText : styles.inactiveTabText}>Sign Up</Text>
                </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
                {isLogin ? <LoginForm /> : <SignupForm />}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#0B0D16',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 40,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 5,
    },
    subtitle: {
        color: '#aaa',
        marginBottom: 20,
    },
    switchTabs: {
        flexDirection: 'row',
        backgroundColor: '#181B2D',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#3B82F6',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '600',
    },
    inactiveTabText: {
        color: '#aaa',
    },
    form: {
        width: '100%',
    },
});