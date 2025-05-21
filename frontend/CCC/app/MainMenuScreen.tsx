import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppColor from '../constants/AppColor';

export default function MainMenuScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Welcome back! 🌿</Text>

            <View style={styles.spacer} />

            <View style={styles.tabBar}>
                <TouchableOpacity onPress={() => {}} style={styles.tabButton}>
                    <Ionicons name="home-outline" size={24} color="#444" />
                    <Text style={styles.tabLabel}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {}} style={styles.tabButton}>
                    <Ionicons name="search-outline" size={24} color="#444" />
                    <Text style={styles.tabLabel}>Explore</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/ReportIssueScreen')} style={styles.reportButton}>
                    <Ionicons name="add-circle" size={60} color={AppColor.primary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {}} style={styles.tabButton}>
                    <Ionicons name="list-outline" size={24} color="#444" />
                    <Text style={styles.tabLabel}>Reports</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/ProfileScreen')}>
                    <Ionicons name="person-outline" size={24} color="#237F52" />
                    <Text style={styles.tabLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColor.background,
        justifyContent: 'flex-end',
    },
    welcome: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: '700',
        color: AppColor.primary,
    },
    spacer: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 80,
        paddingHorizontal: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -3 },
        shadowRadius: 6,
        elevation: 10,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reportButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        top: -20,
    },
    tabLabel: {
        fontSize: 12,
        color: '#237F52',
        marginTop: 4,
        fontWeight: '500',
    },
    menuButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuButtonText: {
        fontSize: 12,
        color: '#237F52',
        marginTop: 4,
    },
});