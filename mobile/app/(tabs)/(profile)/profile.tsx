import { View, Text } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const { theme } = useTheme();
  console.log("eagsdeeeeeeeesdfasgaadeeeeeeeeeee")
  return (
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme === 'dark' ? '#000' : '#fff' }}>
      <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>Profile</Text>
      <Link href="/clientReservations" style={{ color: theme === 'dark' ? '#4A90E2' : '#007AFF' }}>Go to client reservations</Link>
      <Link href="/clientTournaments" style={{ color: theme === 'dark' ? '#4A90E2' : '#007AFF' }}>Go to client tournaments</Link>
    </View>
  );
}