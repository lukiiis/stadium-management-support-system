import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetUserData, useUpdateData, useChangePassword } from '@/api/clientInfoTabService';
import { useForm, Controller } from 'react-hook-form';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { EditUserData, ChangePasswordData } from '@/shared/types/models/user';
import { ApiErrorResponse } from '@/shared/types/api/apiResponse';
import { AxiosError } from 'axios';
import toastConfig from '@/shared/component_config/toastConfig';
import { useTheme } from '@/context/ThemeContext';

export default function ClientInfoScreen() {
  const { theme } = useTheme();

  const [userId, setUserId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const personalDataForm = useForm<EditUserData>();
  const passwordForm = useForm<ChangePasswordData>();

  useEffect(() => {
    loadUserId();
  }, []);

  const loadUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    if (id) setUserId(parseInt(id));
  };

  const { data: userData, isLoading, refetch } = useGetUserData(userId || 0);
  const updateDataMutation = useUpdateData();
  const changePasswordMutation = useChangePassword();

  useEffect(() => {
    if (userData) {
      personalDataForm.reset({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        age: userData.age,
      });
    }
  }, [userData]);

  const handleUpdatePersonalData = (data: EditUserData) => {
    if (!userId) return;
    updateDataMutation.mutate(
      { ...data, userId },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Personal data updated successfully',
            position: 'bottom',
          });
          setIsEditing(false);
          refetch();
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.response?.data.error || 'Failed to update data',
            position: 'bottom',
          });
        },
      }
    );
  };

  const handleChangePassword = (data: ChangePasswordData) => {
    if (!userId) return;
    changePasswordMutation.mutate(
      { userId, passwordData: data },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Password changed successfully',
            position: 'bottom',
          });
          passwordForm.reset();
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.response?.data.error || 'Failed to change password',
            position: 'bottom',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-gray-600 dark:text-gray-300">Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 py-6">
        <Animated.View
          entering={FadeInDown.delay(100)}
          className="flex-row items-center mb-6"
        >
          <Ionicons name="person-circle-outline" size={24} color={theme === 'dark' ? '#fff' : '#1f2937'} />
          <Text className="text-2xl font-bold text-gray-800 dark:text-white ml-2">
            My Data
          </Text>
        </Animated.View>
        {/* Personal Info Section */}
        <Animated.View entering={FadeInDown.delay(200)} className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800 dark:text-white">Personal Information</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Ionicons name={isEditing ? "close" : "create-outline"} size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View>
              <Controller
                control={personalDataForm.control}
                name="firstName"
                rules={{ required: 'First name is required' }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <View>
                    <TextInput
                      className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-1 text-gray-800 dark:text-white ${error ? 'border-2 border-red-500' : ''}`}
                      onChangeText={onChange}
                      value={value}
                      placeholder="First Name"
                      placeholderTextColor="#9CA3AF"
                    />
                    {error && <Text className="text-red-500 mb-3">{error.message}</Text>}
                  </View>
                )}
              />

              <Controller
                control={personalDataForm.control}
                name="lastName"
                rules={{ required: 'Last name is required' }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <View>
                    <TextInput
                      className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-1 text-gray-800 dark:text-white ${error ? 'border-2 border-red-500' : ''}`}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Last Name"
                      placeholderTextColor="#9CA3AF"
                    />
                    {error && <Text className="text-red-500 mb-3">{error.message}</Text>}
                  </View>
                )}
              />

              <Controller
                control={personalDataForm.control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <View>
                    <TextInput
                      className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-1 text-gray-800 dark:text-white ${error ? 'border-2 border-red-500' : ''}`}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#9CA3AF"
                    />
                    {error && <Text className="text-red-500 mb-3">{error.message}</Text>}
                  </View>
                )}
              />

              <Controller
                control={personalDataForm.control}
                name="phone"
                rules={{
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: 'Invalid phone number'
                  }
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <View>
                    <TextInput
                      className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-1 text-gray-800 dark:text-white ${error ? 'border-2 border-red-500' : ''}`}
                      onChangeText={onChange}
                      value={value?.toString()}
                      placeholder="Phone Number"
                      keyboardType="phone-pad"
                      placeholderTextColor="#9CA3AF"
                    />
                    {error && <Text className="text-red-500 mb-3">{error.message}</Text>}
                  </View>
                )}
              />

              <Controller
                control={personalDataForm.control}
                name="age"
                rules={{
                  min: {
                    value: 18,
                    message: 'Age must be at least 18'
                  },
                  max: {
                    value: 120,
                    message: 'Invalid age'
                  }
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <View>
                    <TextInput
                      className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-1 text-gray-800 dark:text-white ${error ? 'border-2 border-red-500' : ''}`}
                      onChangeText={(text) => onChange(text ? parseInt(text) : '')}
                      value={value?.toString()}
                      placeholder="Age"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                    {error && <Text className="text-red-500 mb-3">{error.message}</Text>}
                  </View>
                )}
              />

              <View className="flex-row justify-end space-x-4 mt-6">
                <TouchableOpacity
                  onPress={personalDataForm.handleSubmit(handleUpdatePersonalData)}
                  className="bg-green-500 p-4 rounded-lg flex-1"
                >
                  <Text className="text-center font-semibold text-white">Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 dark:text-gray-300">Name:</Text>
                <Text className="text-gray-800 dark:text-white font-medium">
                  {userData?.firstName} {userData?.lastName}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 dark:text-gray-300">Email:</Text>
                <Text className="text-gray-800 dark:text-white font-medium">{userData?.email}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 dark:text-gray-300">Phone:</Text>
                <Text className="text-gray-800 dark:text-white font-medium">{userData?.phone || 'Not set'}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600 dark:text-gray-300">Age:</Text>
                <Text className="text-gray-800 dark:text-white font-medium">{userData?.age || 'Not set'}</Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Password Change Section */}
        <Animated.View
          entering={FadeInDown.delay(300)}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm"
        >
          <View className="flex-row items-center mb-4">
            <Ionicons name="lock-closed-outline" size={24} color="#3b82f6" />
            <Text className="text-xl font-bold text-gray-800 dark:text-white ml-2">
              Change Password
            </Text>
          </View>

          <Controller
            control={passwordForm.control}
            name="currentPassword"
            rules={{ required: 'Current password is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <TextInput
                  className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-1 text-gray-800 dark:text-white ${error ? 'border-2 border-red-500' : ''}`}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Current Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
                {error && <Text className="text-red-500 mb-3">{error.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={passwordForm.control}
            name="newPassword"
            rules={{
              required: 'New password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <TextInput
                  className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-1 text-gray-800 dark:text-white ${error ? 'border-2 border-red-500' : ''}`}
                  onChangeText={onChange}
                  value={value}
                  placeholder="New Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
                {error && <Text className="text-red-500 mb-3">{error.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={passwordForm.control}
            name="confirmPassword"
            rules={{
              required: 'Please confirm your password',
              validate: (value) =>
                value === passwordForm.getValues('newPassword') || 'Passwords do not match'
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <TextInput
                  className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-1 text-gray-800 dark:text-white ${error ? 'border-2 border-red-500' : ''}`}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Confirm New Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                />
                {error && <Text className="text-red-500 mb-3">{error.message}</Text>}
              </View>
            )}
          />

          <TouchableOpacity
            onPress={passwordForm.handleSubmit(handleChangePassword)}
            className="bg-blue-500 p-4 rounded-lg mt-4"
          >
            <Text className="text-white text-center font-semibold">
              {changePasswordMutation.isPending ? 'Changing Password...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      <Toast
        config={toastConfig}
        position='bottom'
        bottomOffset={20}
        visibilityTime={3000}
      />
    </>
  );
}