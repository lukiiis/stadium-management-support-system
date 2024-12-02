// components/TournamentCard.tsx
import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { TournamentDto } from '@/shared/types/models/tournament'

export default function TournamentCard({ 
  tournament, 
  index 
}: { 
  tournament: TournamentDto
  index: number 
}) {
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
        
        <TouchableOpacity
          className="bg-blue-500 py-3 px-4 rounded-lg"
          onPress={() => {}}
        >
          <Text className="text-white text-center font-semibold">
            Join Tournament
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}