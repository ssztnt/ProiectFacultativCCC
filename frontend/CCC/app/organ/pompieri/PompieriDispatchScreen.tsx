import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';
import { styles } from '../constants/dispatchScreenStyle';

const { width } = Dimensions.get('window');
const firefighterColors = Colors.firefighters;

export default function PompieriDispatchScreen() {
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        // Initial entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: selectedTeam ? 1.02 : 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start();
    }, [selectedTeam]);

    const teams = [
        {
            id: 'bravo',
            name: 'Team BRAVO',
            code: 'B-01',
            members: ['Mihai', 'Andrei', 'Mihnea', 'Mircea'],
            truck: 'Ford F350',
            location: 'Street Constanta',
            status: 'Ready',
            gradient: firefighterColors.gradient,
            icon: '🚒',
        },
        {
            id: 'alpha',
            name: 'Team ALPHA',
            code: 'A-01',
            members: ['Ioana', 'Dani', 'Dan', 'Darius'],
            truck: 'Ford F500',
            location: 'Street Bucuresti',
            status: 'Ready',
            gradient: firefighterColors.gradient,
            icon: '🚛',
        },
    ];

    const handleTeamSelect = (teamId: string) => {
        setSelectedTeam(selectedTeam === teamId ? null : teamId);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[firefighterColors.background, '#f8f9fa']}
                style={StyleSheet.absoluteFillObject}
            />

            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                <Text style={styles.title}>🚨 Emergency Dispatch</Text>
                <Text style={styles.subtitle}>Select a team to deploy</Text>
            </Animated.View>

            <Animated.View
                style={[
                    styles.teamsContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}
            >
                {teams.map((team, index) => {
                    const isSelected = selectedTeam === team.id;

                    return (
                        <Animated.View
                            key={team.id}
                            style={[
                                styles.teamWrapper,
                                {
                                    transform: [{
                                        scale: isSelected ? scaleAnim : 1
                                    }]
                                }
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => handleTeamSelect(team.id)}
                                activeOpacity={0.9}
                                style={styles.teamTouchable}
                            >
                                <LinearGradient
                                    colors={isSelected ? firefighterColors.gradient as [string, string] : ['#ffffff', '#f8f9fa']}
                                    style={[
                                        styles.teamCard,
                                        isSelected && styles.selectedCard
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    {/* Header */}
                                    <View style={styles.teamHeader}>
                                        <View style={styles.teamHeaderLeft}>
                                            <Text style={styles.teamIcon}>{team.icon}</Text>
                                            <View>
                                                <Text style={[
                                                    styles.teamName,
                                                    { color: isSelected ? '#fff' : firefighterColors.primaryDark }
                                                ]}>
                                                    {team.name}
                                                </Text>
                                                <Text style={[
                                                    styles.teamCode,
                                                    { color: isSelected ? '#ffffff90' : '#666' }
                                                ]}>
                                                    {team.code}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: isSelected ? '#ffffff20' : '#00D68F20' }
                                        ]}>
                                            <Text style={[
                                                styles.statusText,
                                                { color: isSelected ? '#fff' : '#00D68F' }
                                            ]}>
                                                {team.status}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Team Members */}
                                    <View style={styles.membersSection}>
                                        <Text style={[
                                            styles.sectionLabel,
                                            { color: isSelected ? '#ffffff90' : '#666' }
                                        ]}>
                                            Team Members ({team.members.length})
                                        </Text>
                                        <View style={styles.membersGrid}>
                                            {team.members.map((member, memberIndex) => (
                                                <View key={memberIndex} style={[
                                                    styles.memberChip,
                                                    { backgroundColor: isSelected ? '#ffffff20' : '#f1f3f4' }
                                                ]}>
                                                    <Text style={[
                                                        styles.memberName,
                                                        { color: isSelected ? '#fff' : '#333' }
                                                    ]}>
                                                        {member}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Equipment & Location */}
                                    <View style={styles.detailsSection}>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailIcon}>🚗</Text>
                                            <Text style={[
                                                styles.detailText,
                                                { color: isSelected ? '#ffffff90' : '#666' }
                                            ]}>
                                                {team.truck}
                                            </Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailIcon}>📍</Text>
                                            <Text style={[
                                                styles.detailText,
                                                { color: isSelected ? '#ffffff90' : '#666' }
                                            ]}>
                                                {team.location}
                                            </Text>
                                        </View>
                                    </View>

                                    {isSelected && (
                                        <Animated.View style={styles.deployButton}>
                                            <LinearGradient
                                                colors={['#ffffff20', '#ffffff10']}
                                                style={styles.deployButtonGradient}
                                            >
                                                <Text style={styles.deployButtonText}>
                                                    🚀 DEPLOY NOW
                                                </Text>
                                            </LinearGradient>
                                        </Animated.View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}
            </Animated.View>
        </View>
    );
}