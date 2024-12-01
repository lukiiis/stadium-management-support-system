import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

export default function TournamentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>tornaments</Text>
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