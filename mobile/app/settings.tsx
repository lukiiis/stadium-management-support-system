import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

export default function SettingsScreen() {
    return (
        <View>
            <Text className='color-yellow-500'>setinks</Text>
            <Link href="/">Go to home</Link>
        </View>
    );
}