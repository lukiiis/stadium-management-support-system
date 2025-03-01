import { AuthGuard } from '@/components/AuthGuard';
import { Stack } from 'expo-router';
import React from 'react';

export default function ProfileLayout() {
  return (
    <AuthGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen name="profile" />
        <Stack.Screen name="clientReservations" />
        <Stack.Screen name="clientTournaments" />
        <Stack.Screen name="clientInfo" />
      </Stack>
    </AuthGuard>
  );
}