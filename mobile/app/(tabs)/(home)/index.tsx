import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text className='color-yellow-500'>fffhome</Text>
            <Link href="/objects">Go tfffddo objects</Link>
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