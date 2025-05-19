import { useEffect } from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
    FadeIn,
    FadeOut,
    ZoomIn,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import AppColor from '../constants/AppColor';

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function WelcomeScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();
    const router = useRouter();

    const scale = useSharedValue(1);

    useEffect(() => {
        // Start pulsing
        scale.value = withRepeat(withTiming(1.05, { duration: 800 }), -1, true);

        // Navigate after 3s
        const timeout = setTimeout(() => {
            router.replace('/MainMenuScreen');
        }, 6000);

        return () => clearTimeout(timeout);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <LinearGradient colors={['#d0f0e0', '#b2dfdb']} style={styles.container}>
            <Animated.Image
                source={require('../assets/images/logocircular.png')}
                style={styles.logo}
                entering={ZoomIn.duration(800)}
            />

            <AnimatedText
                style={[styles.title, animatedStyle]}
                entering={FadeIn.duration(800)}
                exiting={FadeOut.duration(800)}
            >
                Bine ai venit, {username} 🌱
            </AnimatedText>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    logo: {
        width: 120, // puțin mai mare pentru vizibilitate
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#237F52',
        textAlign: 'center',
        maxWidth: '90%', // evită overflow pe device-uri mici
    },
});