import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import PolitieIssuesScreen from './PolitieIssuesScreen';
import PolitieDispatchScreen from './PolitieDispatchScreen';
import PolitieSettingsScreen from './PolitieSettingsScreen';

const Tab = createBottomTabNavigator();

export default function PolitieScreen() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Issues') iconName = 'list';
                    else if (route.name === 'Dispatch') iconName = 'send';
                    else if (route.name === 'Settings') iconName = 'settings';
                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0a3d62',
                tabBarInactiveTintColor: '#888',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Issues" component={PolitieIssuesScreen} />
            <Tab.Screen name="Dispatch" component={PolitieDispatchScreen} />
            <Tab.Screen name="Settings" component={PolitieSettingsScreen} />
        </Tab.Navigator>
    );
}