import React from 'react';
import { Switch, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>Dark Mode</Text>
      <Switch
        value={theme === 'dark'}
        onValueChange={toggleTheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  label: {
    marginRight: 10,
  },
});