// 📁 components/AppLayout.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import AppColor from '../constants/AppColor';

interface AppLayoutProps {
    children: React.ReactNode;
    hideFooter?: boolean;
}

export default function AppLayout({ children, hideFooter = false }: AppLayoutProps) {
    const pathname = usePathname();

    const isActive = (route: string) => {
        return pathname === route || pathname.includes(route);
    };

    const getTabColor = (route: string) => {
        return isActive(route) ? AppColor.primary : '#444';
    };

    if (hideFooter) {
        return <View style={styles.container}>{children}</View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {children}
            </View>

            {/* Footer Navigation */}
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => router.replace('/HomeScreen')}
                    style={styles.tabButton}
                >
                    <Ionicons
                        name={isActive('/HomeScreen') ? "home" : "home-outline"}
                        size={24}
                        color={getTabColor('/HomeScreen')}
                    />
                    <Text style={[styles.tabLabel, { color: getTabColor('/HomeScreen') }]}>
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace('/ExploreScreen')}
                    style={styles.tabButton}
                >
                    <Ionicons
                        name={isActive('/ExploreScreen') ? "search" : "search-outline"}
                        size={24}
                        color={getTabColor('/ExploreScreen')}
                    />
                    <Text style={[styles.tabLabel, { color: getTabColor('/ExploreScreen') }]}>
                        Explore
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace('/ReportIssueScreen')}
                    style={styles.reportButton}
                >
                    <Ionicons name="add-circle" size={60} color={AppColor.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace('/ViewHistoryReports')}
                    style={styles.tabButton}
                >
                    <Ionicons
                        name={isActive('/ViewHistoryReports') ? "list" : "list-outline"}
                        size={24}
                        color={getTabColor('/ViewHistoryReports')}
                    />
                    <Text style={[styles.tabLabel, { color: getTabColor('/ViewHistoryReports') }]}>
                        Reports
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace('/ProfileScreen')}
                    style={styles.tabButton}
                >
                    <Ionicons
                        name={isActive('/ProfileScreen') ? "person" : "person-outline"}
                        size={24}
                        color={getTabColor('/ProfileScreen')}
                    />
                    <Text style={[styles.tabLabel, { color: getTabColor('/ProfileScreen') }]}>
                        Profile
                    </Text>
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
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 80,
        paddingHorizontal: 10,
        paddingBottom: 10,
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
        top: 0,
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
});