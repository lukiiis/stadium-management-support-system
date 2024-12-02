import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

export default function ClientTournamentsScreen() {
    return (
        <View style={styles.container}>
            <Text className='color-yellow-500'>Client Tournaments</Text>
            <Link href="/profile">Go to profile</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
});