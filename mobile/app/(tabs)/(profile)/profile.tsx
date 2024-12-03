// app/(tabs)/(profile)/profile.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authEmitter } from '../_layout';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    role: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const firstName = await AsyncStorage.getItem('firstName') || '';
    const lastName = await AsyncStorage.getItem('lastName') || '';
    const role = await AsyncStorage.getItem('role') || '';
    setUserData({ firstName, lastName, role });
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    authEmitter.emit('authStateChanged');
    router.replace('/login');
  };

  return (
    <View className="flex-1 px-4 py-8 bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <Animated.View 
        entering={FadeInDown.delay(100)}
        className="items-center mb-8"
      >
        <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4">
          <Ionicons name="person" size={40} color="white" />
        </View>
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">
          {userData.firstName} {userData.lastName}
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 mt-1">
          {userData.role}
        </Text>
      </Animated.View>

      {/* Navigation Cards */}
      <Animated.View 
        entering={FadeInDown.delay(200)}
        className="space-y-4"
      >
        <TouchableOpacity
          onPress={() => router.push('/clientReservations')}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl flex-row items-center"
        >
          <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center">
            <Ionicons name="calendar" size={24} color={theme === 'dark' ? '#60A5FA' : '#3B82F6'} />
          </View>
          <View className="ml-4">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white">My Reservations</Text>
            <Text className="text-gray-600 dark:text-gray-400">View your upcoming bookings</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/clientTournaments')}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl flex-row items-center"
        >
          <View className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full items-center justify-center">
            <Ionicons name="trophy" size={24} color={theme === 'dark' ? '#4ADE80' : '#22C55E'} />
          </View>
          <View className="ml-4">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white">My Tournaments</Text>
            <Text className="text-gray-600 dark:text-gray-400">Check your tournament entries</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Logout Button */}
      <Animated.View 
        entering={FadeInUp.delay(300)}
        className="mt-auto"
      >
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 p-4 rounded-xl flex-row items-center justify-center"
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text className="ml-2 text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}