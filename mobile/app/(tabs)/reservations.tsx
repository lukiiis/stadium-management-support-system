// app/(tabs)/reservations.tsx
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useGetDaySchedule, useGetAllObjectTypes } from '@/api/reservationsTabService'
import { Picker } from '@react-native-picker/picker'
import TimeSheet from '@/components/TimeSheet'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/context/ThemeContext'

export default function ReservationsScreen() {
  const { theme } = useTheme();

  const [date, setDate] = useState(new Date())
  const [selectedObjectId, setSelectedObjectId] = useState<number>(1)
  const [selectedHours, setSelectedHours] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')

  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  const { data: schedule, isLoading, error } = useGetDaySchedule(formattedDate, selectedObjectId)
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

  return (
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
      </View>
    </ScrollView>
  )
}