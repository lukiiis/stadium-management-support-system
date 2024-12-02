// app/(tabs)/reservations.tsx
import { View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useGetDaySchedule, useGetAllObjectTypes } from '@/api/reservationsTabService'
import { Picker } from '@react-native-picker/picker'
import TimeSheet from '@/components/TimeSheet'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'

export default function ReservationsScreen() {
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
      <View className="p-4">
        <Picker
          selectedValue={selectedObjectId}
          onValueChange={(itemValue) => setSelectedObjectId(Number(itemValue))}
          className="bg-white dark:bg-gray-800 rounded-lg mb-4"
        >
          {objectTypes?.map(object => (
            <Picker.Item
              key={object.objectId}
              label={`${object.type} - ${object.description}`}
              value={object.objectId}
            />
          ))}
        </Picker>

        <Animated.View
          entering={FadeIn}
          className="flex-row items-center justify-between mb-4"
        >
          <TouchableOpacity
            onPress={handlePreviousDay}
            disabled={date.toDateString() === new Date().toDateString()}
            className={`p-3 rounded-full shadow-sm ${date.toDateString() === new Date().toDateString()
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'bg-white dark:bg-gray-800'
              }`}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={date.toDateString() === new Date().toDateString() ? '#9CA3AF' : '#4A90E2'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNextDay}
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm"
          >
            <Ionicons name="chevron-forward" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </Animated.View>

        {schedule && (
          <TimeSheet
            date={formattedDate}
            schedule={schedule}
            selectedHours={selectedHours}
            onHourSelect={handleHourSelect}
          />
        )}
      </View>
    </ScrollView>
  )
}