// app/(tabs)/reservations.tsx
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGetDaySchedule, useGetAllObjectTypes, useCreateReservation, calculateTimeRangeAndPrice } from '@/api/reservationsTabService'
import { Picker } from '@react-native-picker/picker'
import TimeSheet from '@/components/TimeSheet'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useTheme } from '@/context/ThemeContext'
import { CreateReservationData } from '@/shared/types/models/reservation'
import { ApiErrorResponse, ApiSuccessResponse } from '@/shared/types/api/apiResponse'
import { AxiosError } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authEmitter } from './_layout'
import Toast from 'react-native-toast-message'
import toastConfig from '@/shared/component_config/toastConfig'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ReservationsScreen() {
  const [userId, setUserId] = useState<number | null>(null)
  // functionality checking if user is logged in
  useEffect(() => {
    loadUserId();

    const handleAuthChange = () => {
      loadUserId();
    };

    authEmitter.on('authStateChanged', handleAuthChange);

    return () => {
      authEmitter.off('authStateChanged', handleAuthChange);
    };
  }, []);

  const loadUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserId(id ? parseInt(id) : null);
  };

  const { theme } = useTheme();

  const [step, setStep] = useState<number>(1);
  const nextStep = () => {
    if (userId) {
      setStep(prevStep => prevStep + 1);
    }
    else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: "You have to be logged in to continue",
        position: 'bottom',
        visibilityTime: 3000
      })
    }
  };

  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const [date, setDate] = useState(new Date())
  const [payNow, setPayNow] = useState<boolean>(true);
  const [selectedObjectId, setSelectedObjectId] = useState<number>(1)
  const [selectedHours, setSelectedHours] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')

  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  const { data: schedule, isLoading, error, refetch } = useGetDaySchedule(formattedDate, selectedObjectId)
  const { data: objectTypes } = useGetAllObjectTypes()

  const handlePreviousDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() - 1)
    setDate(newDate)
    setSelectedHours([])
    setSelectedDate('')
  }

  const handleNextDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() + 1)
    setDate(newDate)
    setSelectedHours([])
    setSelectedDate('')
  }

  const handleHourSelect = (hour: string, date: string) => {
    if (selectedDate === '') {
      setSelectedDate(date)
      setSelectedHours([hour])
    } else if (date === selectedDate) {
      const isAdjacent = selectedHours.some(selectedHour => {
        const selectedHourInt = parseInt(selectedHour.split(':')[0], 10)
        const hourInt = parseInt(hour.split(':')[0], 10)
        return Math.abs(selectedHourInt - hourInt) === 1
      })

      if (selectedHours.includes(hour)) {
        const sortedHours = [...selectedHours].sort()
        const currentIndex = sortedHours.indexOf(hour)
        const prevHour = sortedHours[currentIndex - 1]
        const nextHour = sortedHours[currentIndex + 1]

        if (prevHour && nextHour) {
          const [prevH] = prevHour.split(':').map(Number)
          const [currH] = hour.split(':').map(Number)
          const [nextH] = nextHour.split(':').map(Number)

          if (prevH === currH - 1 && nextH === currH + 1) {
            return
          }
        }

        setSelectedHours(prev => prev.filter(h => h !== hour))
      } else if (selectedHours.length === 0 || isAdjacent) {
        setSelectedHours(prev => [...prev, hour])
      }
    }
  }

  //mutation
  const { startTime, endTime, price } = calculateTimeRangeAndPrice(selectedHours);
  const createReservationMutation = useCreateReservation();

  const createReservation = async () => {
    const reservationData: CreateReservationData = {
      reservationStart: startTime,
      reservationEnd: endTime,
      reservationDate: selectedDate,
      price: price,
      objectId: selectedObjectId,
      userId: userId,
      isPaid: payNow,
    }

    createReservationMutation.mutate(reservationData, {
      onSuccess: (data: ApiSuccessResponse) => {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: data.message,
          position: 'bottom',
          visibilityTime: 3000
        })
        refetch();
        setStep(1);
        setSelectedHours([])
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response?.data.error || 'Failed to create reservation',
          position: 'bottom',
          visibilityTime: 3000
        })
      }
    })
  }

  return (
    <>
      <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="px-4 py-6">
          <Animated.View
            entering={FadeInDown.delay(100)}
            className="flex-row items-center mb-6"
          >
            <Ionicons name="calendar" size={24} color={theme === 'dark' ? '#fff' : '#1f2937'} />
            <Text className="text-2xl font-bold text-gray-800 dark:text-white ml-2">
              Make a Reservation
            </Text>
          </Animated.View>
          {step === 1 ? (
            <>
              <Animated.View
                entering={FadeInDown.delay(200)}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm"
              >
                <View className="flex-row items-center mb-4">
                  <Ionicons name="basketball-outline" size={20} color="#3b82f6" />
                  <Text className="text-lg font-semibold text-gray-800 dark:text-white ml-2">
                    Select Facility
                  </Text>
                </View>

                <View className="bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Picker
                    selectedValue={selectedObjectId}
                    onValueChange={(itemValue) => setSelectedObjectId(itemValue)}
                    style={{ color: theme === 'dark' ? '#fff' : '#1f2937' }}
                  >
                    {objectTypes?.map((object) => (
                      <Picker.Item
                        key={object.objectId}
                        label={object.type}
                        value={object.objectId}
                      />
                    ))}
                  </Picker>
                </View>
              </Animated.View>
              {schedule && (
                <TimeSheet
                  date={formattedDate}
                  schedule={schedule}
                  selectedHours={selectedHours}
                  onHourSelect={handleHourSelect}
                  onPreviousDay={handlePreviousDay}
                  onNextDay={handleNextDay}
                  isToday={date.toDateString() === new Date().toDateString()}
                />
              )}
              <Animated.View
                entering={FadeInDown.delay(200)}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm"
              >
                <TouchableOpacity
                  disabled={!selectedObjectId || selectedHours.length === 0}
                  onPress={nextStep}
                  className={
                    !selectedObjectId || selectedHours.length === 0
                      ? "bg-gray-200 dark:bg-gray-700 py-4 px-6 rounded-xl flex-row items-center justify-center"
                      : "bg-blue-500 dark:bg-blue-600 py-4 px-6 rounded-xl flex-row items-center justify-center"
                  }
                >
                  <AntDesign
                    name="stepforward"
                    size={24}
                    color={!selectedObjectId || selectedHours.length === 0 ? "#6b7280" : "white"}
                  />
                  <Text className={
                    !selectedObjectId || selectedHours.length === 0
                      ? "text-gray-500 dark:text-gray-400 font-semibold ml-2"
                      : "text-white font-semibold ml-2"
                  }>
                    Continue
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            <>
              <View className="px-4">
                <Animated.View
                  entering={FadeInDown.duration(600)}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
                >
                  {/* Header */}
                  <View className="flex-row items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                    <View className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                      <Ionicons name="document-text-outline" size={24} color="#3b82f6" />
                    </View>
                    <Text className="text-xl font-bold text-gray-800 dark:text-white ml-3">
                      Confirm Reservation
                    </Text>
                  </View>

                  <View className="space-y-6">
                    {/* Date & Time */}
                    <View className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <View className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                            <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                          </View>
                          <Text className="text-gray-600 dark:text-gray-400 ml-3 font-medium">Date</Text>
                        </View>
                        <Text className="text-gray-800 dark:text-gray-200 font-semibold">
                          {selectedDate}
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <View className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                            <Ionicons name="time-outline" size={20} color="#3b82f6" />
                          </View>
                          <Text className="text-gray-600 dark:text-gray-400 ml-3 font-medium">Time</Text>
                        </View>
                        <Text className="text-gray-800 dark:text-gray-200 font-semibold">
                          {startTime} - {endTime}
                        </Text>
                      </View>
                    </View>

                    {/* Facility & Price */}
                    <View className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <View className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                            <Ionicons name="basketball-outline" size={20} color="#3b82f6" />
                          </View>
                          <Text className="text-gray-600 dark:text-gray-400 ml-3 font-medium">Facility</Text>
                        </View>
                        <Text className="text-gray-800 dark:text-gray-200 font-semibold">
                          {objectTypes?.find(obj => obj.objectId === selectedObjectId)?.type}
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <View className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                            <Ionicons name="wallet-outline" size={20} color="#3b82f6" />
                          </View>
                          <Text className="text-gray-600 dark:text-gray-400 ml-3 font-medium">Price</Text>
                        </View>
                        <Text className="text-gray-800 dark:text-gray-200 font-semibold">
                          ${price}
                        </Text>
                      </View>
                    </View>

                    {/* Payment Toggle */}
                    <View className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <View className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full">
                            <Ionicons name="card-outline" size={20} color="#3b82f6" />
                          </View>
                          <Text className="text-gray-600 dark:text-gray-400 ml-3 font-medium">Pay Now</Text>
                        </View>
                        <Switch
                          value={payNow}
                          onValueChange={setPayNow}
                          trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
                          thumbColor={payNow ? '#3b82f6' : '#f4f4f5'}
                        />
                      </View>
                    </View>
                  </View>
                </Animated.View>

                {/* Action Buttons */}
                <View className="space-y-3">
                  <TouchableOpacity
                    onPress={createReservation}
                    className="bg-green-500 dark:bg-green-600 py-4 px-6 rounded-xl flex-row items-center justify-center shadow-lg active:opacity-90"
                  >
                    <View className="bg-green-400/20 p-2 rounded-full mr-2">
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={24}
                        color="white"
                      />
                    </View>
                    <Text className="text-white font-semibold text-lg">Create Reservation</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={prevStep}
                    className="bg-gray-100 dark:bg-gray-700 py-4 px-6 rounded-xl flex-row items-center justify-center shadow-sm active:opacity-90"
                  >
                    <AntDesign
                      name="stepbackward"
                      size={24}
                      color={theme === 'dark' ? '#e5e7eb' : '#4b5563'}
                    />
                    <Text className="text-gray-700 dark:text-gray-200 font-semibold ml-2">
                      Go back
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
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