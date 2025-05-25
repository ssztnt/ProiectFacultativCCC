import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';

export default function WebViewScreen() {
    const { url } = useLocalSearchParams();

    return (
        <View style={{ flex: 1 }}>
            <WebView source={{ uri: url as string }} />
        </View>
    );
}