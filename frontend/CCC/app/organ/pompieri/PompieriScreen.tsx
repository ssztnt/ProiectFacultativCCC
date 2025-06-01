import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import PompieriIssuesScreen from './PompieriIssuesScreen';
import PompieriDispatchScreen from './PompieriDispatchScreen';
import PompieriSettingsScreen from './PompieriSettingsScreen';

const Tab = createBottomTabNavigator();

export default function PompieriScreen() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Issues') iconName = 'flame';
                    else if (route.name === 'Dispatch') iconName = 'send';
                    else if (route.name === 'Settings') iconName = 'settings';
                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#660000',
                tabBarInactiveTintColor: '#888',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Issues" component={PompieriIssuesScreen} />
            <Tab.Screen name="Dispatch" component={PompieriDispatchScreen} />
            <Tab.Screen name="Settings" component={PompieriSettingsScreen} />
        </Tab.Navigator>
    );
}