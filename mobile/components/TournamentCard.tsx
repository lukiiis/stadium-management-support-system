// components/TournamentCard.tsx
import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { TournamentDto } from '@/shared/types/models/tournament'
import { useTheme } from '@/context/ThemeContext'

interface TournamentCardProps {
  tournament: TournamentDto
  index: number
  isUserInTournament: boolean
  onJoin: () => void
  onLeave: () => void
  userId: number | null
}

export default function TournamentCard({
  tournament,
  index,
  isUserInTournament,
  onJoin,
  onLeave,
  userId
}: TournamentCardProps) {
  const { theme } = useTheme()

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      className="mx-4 mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
    >
      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <Ionicons
            name="trophy"
            size={24}
            className="text-blue-500"
          />
          <Text className="text-lg font-bold ml-2 text-gray-800 dark:text-white">
            {tournament.sport}
          </Text>
        </View>

        <Text className="text-gray-600 dark:text-gray-300 mb-3">
          {tournament.description}
        </Text>

        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Ionicons
              name="calendar"
              size={16}
              className="text-gray-500 dark:text-gray-400"
            />
            <Text className="ml-1 text-gray-500 dark:text-gray-400">
              {new Date(tournament.startDate).toLocaleDateString()}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons
              name="people"
              size={16}
              className="text-gray-500 dark:text-gray-400"
            />
            <Text className="ml-1 text-gray-500 dark:text-gray-400">
              {tournament.maxSlots - tournament.occupiedSlots} spots left
            </Text>
          </View>
        </View>

        {userId && (
          <View className="mt-4">
            {isUserInTournament ? (
              <TouchableOpacity
                onPress={onLeave}
                className="bg-red-500 py-3 px-4 rounded-lg flex-row items-center justify-center"
              >
                <Ionicons name="exit-outline" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Leave Tournament</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onJoin}
                className="bg-blue-500 py-3 px-4 rounded-lg flex-row items-center justify-center"
              >
                <Ionicons name="enter-outline" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Join Tournament</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  )
}