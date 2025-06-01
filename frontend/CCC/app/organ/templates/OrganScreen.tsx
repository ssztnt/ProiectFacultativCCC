import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FC } from 'react';

type ScreenComponent = FC<any>;

type Props = {
    Issues: ScreenComponent;
    Dispatch: ScreenComponent;
    Settings: ScreenComponent;
    color?: string;
};

const Tab = createBottomTabNavigator();

const OrganScreen: FC<Props> = ({ Issues, Dispatch, Settings, color = '#0a3d62' }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName = route.name === 'Issues' ? 'list' :
                        route.name === 'Dispatch' ? 'send' : 'settings';
                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: color,
                tabBarInactiveTintColor: '#888',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Issues" component={Issues} />
            <Tab.Screen name="Dispatch" component={Dispatch} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
};

export default OrganScreen;