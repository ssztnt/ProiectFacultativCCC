import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SalubritateIssuesScreen from './SalubritateIssuesScreen';
import SalubritateDispatchScreen from './SalubritateDispatchScreen';
import SalubritateSettingsScreen from './SalubritateSettingsScreen';

const Tab = createBottomTabNavigator();

export default function SalubritateScreen() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Issues') iconName = 'trash';
                    else if (route.name === 'Dispatch') iconName = 'send';
                    else if (route.name === 'Settings') iconName = 'settings';
                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#7be142',
                tabBarInactiveTintColor: '#888',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Issues" component={SalubritateIssuesScreen} />
            <Tab.Screen name="Dispatch" component={SalubritateDispatchScreen} />
            <Tab.Screen name="Settings" component={SalubritateSettingsScreen} />
        </Tab.Navigator>
    );
}