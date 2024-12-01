import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="(home)" />
      <Tabs.Screen name="reservations" />
      <Tabs.Screen name="tournaments" />
      <Tabs.Screen name="objects" />
    </Tabs>
  );
}