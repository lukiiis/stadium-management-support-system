// app/(tabs)/(profile)/clientReservations.tsx
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetPaginatedUserReservations, useCancelReservation } from '@/api/clientReservationsTabService';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/context/ThemeContext';
import dayjs from 'dayjs';
import { ApiErrorResponse, ApiSuccessResponse } from '@/shared/types/api/apiResponse';
import { AxiosError } from 'axios';
import toastConfig from '@/shared/component_config/toastConfig';

export default function ClientReservationsScreen() {
    const { theme } = useTheme();
    const [userId, setUserId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        loadUserId();
    }, []);

    const loadUserId = async () => {
        const id = await AsyncStorage.getItem('userId');
        if (id) setUserId(parseInt(id));
    };

    const { data, isLoading, refetch } = useGetPaginatedUserReservations(userId || 0, page - 1, pageSize);
    const cancelReservationMutation = useCancelReservation();

    const handleCancelReservation = (reservationId: number) => {
        cancelReservationMutation.mutate(reservationId, {
            onSuccess: (data: ApiSuccessResponse) => {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: data.message,
                    position: 'bottom',
                    visibilityTime: 3000
                });
                refetch();
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.response?.data.error || 'Failed to cancel reservation',
                    position: 'bottom',
                    visibilityTime: 3000
                });
            }
        });
    };

    if (!userId) return null;

    return (
        <>
            <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 py-6">
                <Animated.View
                    entering={FadeInDown.delay(100)}
                    className="flex-row items-center mb-6"
                >
                    <Ionicons name="calendar" size={24} color={theme === 'dark' ? '#fff' : '#1f2937'} />
                    <Text className="text-2xl font-bold text-gray-800 dark:text-white ml-2">
                        My Reservations
                    </Text>
                </Animated.View>

                {isLoading ? (
                    <View className="flex-1 justify-center items-center py-8">
                        <Ionicons name="time" size={48} color="#60A5FA" />
                        <Text className="text-gray-600 dark:text-gray-300 mt-4">Loading reservations...</Text>
                    </View>
                ) : data?.items.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-8">
                        <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
                        <Text className="text-gray-500 dark:text-gray-400 mt-4 mb-2">
                            You don't have any reservations yet
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/reservations')}
                            className="mt-4 bg-blue-500 px-6 py-3 rounded-lg flex-row items-center"
                        >
                            <Ionicons name="add-circle-outline" size={20} color="white" />
                            <Text className="text-white font-semibold ml-2">Make a Reservation</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="space-y-4">
                        {data?.items.map((reservation, index) => {
                            const reservationDate = dayjs(reservation.reservationDate);
                            const today = dayjs();
                            const isPastReservation = reservationDate.isBefore(today, 'day');
                            const status = isPastReservation ? 'Completed' : 'Upcoming';

                            return (
                                <Animated.View
                                    key={reservation.reservationId}
                                    entering={FadeInDown.delay(index * 100)}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
                                >
                                    {/* Header Section */}
                                    <View className="flex-row justify-between items-start mb-4">
                                        <View className="flex-row items-center flex-1">
                                            <View className="bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-3">
                                                <Ionicons
                                                    name="location"
                                                    size={24}
                                                    color={theme === 'dark' ? '#60A5FA' : '#3B82F6'}
                                                />
                                            </View>
                                            <View>
                                                <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                                                    {reservation.objectType.type}
                                                </Text>
                                                <Text className="text-sm text-gray-500 dark:text-gray-400">
                                                    Reservation #{reservation.reservationId}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className={`rounded-lg px-3 py-1 ${isPastReservation
                                            ? 'bg-gray-50 dark:bg-gray-700/50'
                                            : 'bg-blue-50 dark:bg-blue-900/50'
                                            }`}>
                                            <Text className={`text-sm font-medium ${isPastReservation
                                                ? 'text-gray-600 dark:text-gray-400'
                                                : 'text-blue-600 dark:text-blue-400'
                                                }`}>
                                                {status}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Time & Date Section */}
                                    <View className="border-t border-b border-gray-100 dark:border-gray-700 py-3 mb-3">
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center">
                                                <Ionicons
                                                    name="calendar-outline"
                                                    size={20}
                                                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                                                />
                                                <Text className="text-gray-600 dark:text-gray-300 ml-2">Date</Text>
                                            </View>
                                            <Text className="text-gray-800 dark:text-gray-200 font-medium">
                                                {dayjs(reservation.reservationDate).format('MMM D, YYYY')}
                                            </Text>
                                        </View>
                                        <View className="flex-row justify-between items-center mt-2">
                                            <View className="flex-row items-center">
                                                <Ionicons
                                                    name="time-outline"
                                                    size={20}
                                                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                                                />
                                                <Text className="text-gray-600 dark:text-gray-300 ml-2">Time</Text>
                                            </View>
                                            <Text className="text-gray-800 dark:text-gray-200">
                                                {reservation.reservationStart} - {reservation.reservationEnd}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Details Section */}
                                    <View className="space-y-2 mb-4">
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center">
                                                <Ionicons
                                                    name="wallet-outline"
                                                    size={20}
                                                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                                                />
                                                <Text className="text-gray-600 dark:text-gray-300 ml-2">Price</Text>
                                            </View>
                                            <Text className="text-gray-800 dark:text-gray-200 font-medium">
                                                ${reservation.price.toFixed(2)}
                                            </Text>
                                        </View>
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center">
                                                <Ionicons
                                                    name="card-outline"
                                                    size={20}
                                                    color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                                                />
                                                <Text className="text-gray-600 dark:text-gray-300 ml-2">Status</Text>
                                            </View>
                                            <Text className={`font-medium ${reservation.paymentStatus === 'PAID'
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-yellow-600 dark:text-yellow-400'
                                                }`}>
                                                {reservation.paymentStatus}
                                            </Text>
                                        </View>
                                    </View>

                                    {!isPastReservation && (
                                        <TouchableOpacity
                                            onPress={() => handleCancelReservation(reservation.reservationId)}
                                            className="mt-2 bg-red-500 py-3 px-4 rounded-lg flex-row items-center justify-center"
                                        >
                                            <Ionicons name="close-circle-outline" size={20} color="white" />
                                            <Text className="text-white font-semibold ml-2">Cancel Reservation</Text>
                                        </TouchableOpacity>
                                    )}
                                </Animated.View>
                            );
                        })}
                    </View>
                )}
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