import { useEffect } from 'react';
import { router, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { authEmitter } from '../app/(tabs)/_layout';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      }
    };

    checkAuth();
    authEmitter.on('authStateChanged', checkAuth);

    return () => {
      authEmitter.off('authStateChanged', checkAuth);
    };
  }, []);

  // check auth on screen focus
  useFocusEffect(
    React.useCallback(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/login');
        }
      };
      checkAuth();
    }, [])
  );

  return <View style={{ flex: 1 }}>{children}</View>;
};