// app/(auth)/login.tsx
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useLoginUser } from '@/api/loginTabService'
import { LoginData, LoginResponse } from '@/shared/types/auth/login'
import { router } from 'expo-router'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { AxiosError } from 'axios'
import Toast, { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message'
import { ApiErrorResponse } from '@/shared/types/api/apiResponse'
import AsyncStorage from '@react-native-async-storage/async-storage'

const toastConfig = {
  success: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#22c55e',
        marginBottom: 100 // Add bottom margin for safe area
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 15, fontWeight: 'bold' }}
      text2Style={{ fontSize: 13 }}
    />
  ),
  error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#ef4444',
        marginTop: 30 // Add bottom margin for safe area
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 15, fontWeight: 'bold' }}
      text2Style={{ fontSize: 13 }}
    />
  )
};

export default function LoginScreen() {
  const loginForm = useForm<LoginData>({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const loginMutation = useLoginUser(loginForm);

  const onSubmit = async (data: LoginData) => {
    await loginMutation.mutateAsync(data, {
      onSuccess: (data: LoginResponse) => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: data.message,
          position: 'bottom',
          visibilityTime: 3000
        });
        //router.replace('/(tabs)/(home)');
        
      },
      onError: async (error: AxiosError<ApiErrorResponse>) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response?.data.error || 'Login failed',
          position: 'bottom',
          visibilityTime: 3000
        });
        // can do this with async function
        console.log("STORAGE", await AsyncStorage.getItem("token"));
        // or this without async function
        console.log("STORAGE", AsyncStorage.getItem("token").then(token => console.log(token)));
      }
    })
  }

  return (
    <>
      <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="flex-1 p-6 justify-center">
          <Animated.View
            entering={FadeInDown.delay(100)}
            className="mb-8"
          >
            <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-600 dark:text-gray-300">
              Sign in to your account
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(200)}
            className="space-y-4 flex"
          >
            <Controller
              control={loginForm.control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email'
                }
              }}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View>
                  <View className="relative">
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color="#9CA3AF"
                      style={{ position: 'absolute', left: 16, top: 16, zIndex: 10 }}
                    />
                    <TextInput
                      placeholder="Email"
                      onChangeText={onChange}
                      value={value}
                      className={`bg-white dark:bg-gray-800 p-4 pl-12 rounded-lg box-border text-gray-800 dark:text-white ${loginForm.formState.errors.email ? 'border-2 border-red-500' : ''
                        }`}
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                  <Text className="text-red-500 mt-1 min-h-5">{loginForm.formState.errors.email?.message}</Text>
                </View>
              )}
            />

            <Controller
              control={loginForm.control}
              rules={{
                required: 'Password is required',
              }}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View className='mb-7'>
                  <View className="relative">
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#9CA3AF"
                      style={{ position: 'absolute', left: 16, top: 16, zIndex: 10 }}
                    />
                    <TextInput
                      placeholder="Password"
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry
                      className={`bg-white dark:bg-gray-800 p-4 pl-12 rounded-lg box-border text-gray-800 dark:text-white ${loginForm.formState.errors.password ? 'border-2 border-red-500' : ''
                        }`}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <Text className="text-red-500 mt-1 min-h-5">{loginForm.formState.errors.password?.message}</Text>
                </View>
              )}
            />

            <TouchableOpacity
              onPress={loginForm.handleSubmit(onSubmit)}
              disabled={loginMutation.isPending}
              className={`bg-blue-500 p-4 rounded-lg ${loginMutation.isPending ? 'opacity-50' : ''
                }`}
            >
              <Text className="text-white text-center font-semibold">
                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {loginMutation.isError && (
              <Text className="text-red-500 text-center">
                Invalid email or password
              </Text>
            )}
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300)}
            className="mt-6 flex-row justify-center"
          >
            <TouchableOpacity
              onPress={() => { }}
              className="flex-row items-center"
            >
              <Text className="text-gray-600 dark:text-gray-300 mr-1">
                Don't have an account?
              </Text>
              <Text className="text-blue-500 font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
      <Toast
        config={toastConfig}
        position='bottom'
        bottomOffset={20}
        visibilityTime={3000}
      />
    </>
  )
}