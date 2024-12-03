// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventEmitter } from 'eventemitter3';

export const authEmitter = new EventEmitter();

export default function TabLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    checkAuthStatus();

    // Listen for auth state changes
    authEmitter.on('authStateChanged', checkAuthStatus);

    return () => {
      authEmitter.off('authStateChanged', checkAuthStatus);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
          tabBarLabel: 'Reservations',
        }}
      />
      <Tabs.Screen
        name="tournaments"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" color={color} size={size} />
          ),
          tabBarLabel: 'Tournaments',
        }}
      />
      <Tabs.Screen
        name="objects"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube" color={color} size={size} />
          ),
          tabBarLabel: 'Objects',
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
          tabBarLabel: 'Profile',
          href: !isAuthenticated ? null : "/(tabs)/(profile)/profile"
        }}
      />
      <Tabs.Screen
        name="(auth)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-in" color={color} size={size} />
          ),
          tabBarLabel: 'Login',
          href: isAuthenticated ? null : "/(tabs)/(auth)/login"
        }}
      />
    </Tabs>
  );
}