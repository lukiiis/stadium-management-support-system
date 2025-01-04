import { View, Text, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import TournamentCard from '@/components/TournamentCard'
import { useGetTournaments, useGetUsersTournaments, useJoinTournament, useLeaveTournament } from '@/api/tournamentsTabService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ApiErrorResponse, ApiSuccessResponse } from '@/shared/types/api/apiResponse'
import { AxiosError } from 'axios'
import Toast from 'react-native-toast-message'
import { authEmitter } from './_layout'
import toastConfig from '@/shared/component_config/toastConfig'

export default function TournamentsScreen() {
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
    if (!id) {
      refetchUserTournaments();
    }
  };

  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, error } = useGetTournaments();
  const { data: userTournaments, refetch: refetchUserTournaments } = useGetUsersTournaments(userId || 0)
  const joinTournamentMutation = useJoinTournament()
  const leaveTournamentMutation = useLeaveTournament()

  const handleJoinTournament = (tournamentId: number) => {
    if (!userId) return

    joinTournamentMutation.mutate(
      { userId, tournamentId, isPaid: false },
      {
        onSuccess: (data: ApiSuccessResponse) => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: data.message,
            position: 'bottom',
            visibilityTime: 3000
          })
          refetchUserTournaments()
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.response?.data.error || 'Failed to join tournament',
            position: 'bottom',
            visibilityTime: 3000
          })
        }
      }
    )
  }

  const handleLeaveTournament = (tournamentId: number) => {
    if (!userId) return

    leaveTournamentMutation.mutate(
      { userId, tournamentId },
      {
        onSuccess: (data: ApiSuccessResponse) => {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: data.message,
            position: 'bottom',
            visibilityTime: 3000
          })
          refetchUserTournaments()
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.response?.data.error || 'Failed to leave tournament',
            position: 'bottom',
            visibilityTime: 3000
          })
        }
      }
    )
  }

  const isUserInTournament = (tournamentId: number): boolean => {
    return userTournaments?.some(
      userTournament => userTournament.tournament.tournamentId === tournamentId
    ) || false
  }


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

  const filteredTournaments = data?.filter(tournament =>
    tournament.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tournament.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
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

        <FlatList
          data={filteredTournaments}
          keyExtractor={(tournament) => tournament.tournamentId.toString()}
          renderItem={({ item: tournament, index }) => (
            <TournamentCard
              tournament={tournament}
              index={index}
              isUserInTournament={isUserInTournament(tournament.tournamentId)}
              onJoin={() => handleJoinTournament(tournament.tournamentId)}
              onLeave={() => handleLeaveTournament(tournament.tournamentId)}
              userId={userId}
            />
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
      <Toast
        config={toastConfig}
        position='bottom'
        bottomOffset={20}
        visibilityTime={3000}
      />
    </>
  )
}