// app/(tabs)/tournaments.tsx
import { View, Text, FlatList, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import TournamentCard from '@/components/TournamentCard'
import { useGetTournaments } from '@/api/tournamentsTabService'

export default function TournamentsScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isLoading, error } = useGetTournaments(0, 10);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Animated.View entering={FadeIn}>
          <Ionicons name="basketball" size={48} className="text-blue-500 mb-4" />
          <Text className="text-gray-600 dark:text-gray-300">Loading tournaments...</Text>
        </Animated.View>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Animated.View entering={FadeIn} className="items-center">
          <Ionicons name="alert-circle" size={48} className="text-red-500 mb-4" />
          <Text className="text-gray-600 dark:text-gray-300">Error: {error.message}</Text>
        </Animated.View>
      </View>
    )
  }

  const filteredTournaments = data?.items.filter(tournament =>
    tournament.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tournament.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(100)}
        className="px-4 pt-4 pb-2"
      >
        <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Tournaments
        </Text>
        <Text className="text-gray-600 dark:text-gray-300 mb-4">
          Find and join upcoming tournaments
        </Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-lg px-4 mb-4">
          <Ionicons name="search" size={20} className="text-gray-400" />
          <TextInput
            className="flex-1 py-2 px-2 text-gray-800 dark:text-white"
            placeholder="Search tournaments..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      {/* Tournaments List */}
      <FlatList
        data={filteredTournaments}
        keyExtractor={(tournament) => tournament.tournamentId.toString()}
        renderItem={({ item: tournament, index }) => (
          <TournamentCard tournament={tournament} index={index} />
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500 dark:text-gray-400">
              No tournaments found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}