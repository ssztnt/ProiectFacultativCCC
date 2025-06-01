import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AppColor from '../constants/AppColor';

export default function MainMenuScreen() {
    const [reportCount, setReportCount] = useState(7); // sample data
    const [resolvedCount, setResolvedCount] = useState(3); // sample data

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.welcome}>Welcome back! 🌿</Text>

                <View style={styles.statsCard}>
                    <Text style={styles.statsTitle}>Community Stats</Text>
                    <Text style={styles.statsText}>📌 {reportCount} issues reported</Text>
                    <Text style={styles.statsText}>✅ {resolvedCount} issues resolved</Text>
                </View>

                <View style={styles.tipsCard}>
                    <Text style={styles.tipTitle}>Did you know?</Text>
                    <Text style={styles.tipText}>Reporting trash on time helps prevent air and soil pollution. 🌍</Text>
                </View>

                <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/ReportIssueScreen')}>
                    <Text style={styles.quickText}>🚨 Report a problem now</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Footer Navigation */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => router.push('/HomeScreen')} style={styles.tabButton}>
                    <Ionicons name="home-outline" size={24} color="#444" />
                    <Text style={styles.tabLabel}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/ExploreScreen')} style={styles.tabButton}>
                    <Ionicons name="search-outline" size={24} color="#444" />
                    <Text style={styles.tabLabel}>Explore</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/ReportIssueScreen')} style={styles.reportButton}>
                    <Ionicons name="add-circle" size={60} color={AppColor.primary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/ViewHistoryReports')} style={styles.tabButton}>
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
    },
    content: {
        paddingTop: 100,
        paddingHorizontal: 16,
        paddingBottom: 120,
    },
    welcome: {
        fontSize: 24,
        fontWeight: '700',
        color: AppColor.primary,
        textAlign: 'center',
        marginBottom: 20,
    },
    statsCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 4,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
    },
    statsText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    tipsCard: {
        backgroundColor: '#DFF6E3',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
    },
    tipText: {
        fontSize: 14,
        color: '#666',
    },
    quickAction: {
        backgroundColor: '#FFD700',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 30,
    },
    quickText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
    },
    footer: {
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
        position: 'absolute',
        bottom: 0,
        width: '100%',
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
});