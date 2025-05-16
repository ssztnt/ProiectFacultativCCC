import { useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import AppColor from '../constants/AppColor';

export default function SplashScreen() {
    const router = useRouter();
    const screenHeight = Dimensions.get('window').height;

    return (
        <View style={styles.container}>
            <View style={styles.content}>

                    <Image
                        source={require('../assets/images/logocircular.png')} // your Earth image path
                        style={{
                            width: 150,
                            height: 150,
                            borderRadius: 60, // Half of width/height = perfect circle
                            resizeMode: 'cover',
                        }}
                    />

                <Text style={styles.quote}>“The Earth is what we all have in common.”</Text>
            </View>

            <TouchableOpacity style={styles.getStartedButton} onPress={() => router.replace('/LoginScreen')}>
                <Text style={styles.buttonText}>Get Started →</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColor.background,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 30,
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    logo: {
        width: 240,
        height: 240,
        borderRadius: 80,
        resizeMode: 'cover',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#237F52',
        marginBottom: 10,
    },
    quote: {
        fontSize: 16,
        color: '#444',
        textAlign: 'center',
        paddingHorizontal: 20,
        fontStyle: 'italic',
        marginTop: 50, // ~3 cm depending on screen DPI
    },
    getStartedButton: {
        backgroundColor: '#237F52',
        width: '100%',
        paddingVertical: 18,
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});