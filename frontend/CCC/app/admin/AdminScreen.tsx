import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AdminIssuesScreen from './AdminIssuesScreen';
import AdminManagerScreen from './AdminManagerScreen';
import AdminSettingsScreen from './AdminSettingsScreen';
import ProfileScreen from "@/app/ProfileScreen";
import AppColor from "@/constants/AppColor";

const Tab = createBottomTabNavigator();

export default function AdminScreen() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Issues') iconName = 'list';
                    else if (route.name === 'Manage') iconName = 'people';
                    else if (route.name === 'Settings') iconName = 'settings';
                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: AppColor.primary,
                tabBarInactiveTintColor: '#888',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Issues" component={AdminIssuesScreen} />
            <Tab.Screen name="Manage" component={AdminManagerScreen} />
            <Tab.Screen name="Settings" component={AdminSettingsScreen} />
        </Tab.Navigator>
    );
}