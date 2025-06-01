import { View, Text, StyleSheet } from 'react-native';

export default function OrganScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>🚓 Ecran Organ de răspundere</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF7E6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: '700',
        color: '#D17F00',
    },
});