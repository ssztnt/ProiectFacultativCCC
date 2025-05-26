import { View, Text, StyleSheet } from 'react-native';

export default function AdminScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>👑 Ecran Admin</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F4EA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: '700',
        color: '#237F52',
    },
});