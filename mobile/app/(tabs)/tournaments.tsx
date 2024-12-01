// FILE: tournaments.tsx

import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTournaments, TournamentDto } from '../../api/tournamentsService';

export default function TournamentsScreen() {


  const { data, error, isLoading } = useQuery({
    queryKey: ['tournaments', 0, 10],
    queryFn: () => fetchTournaments(0, 10)
  }, );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <Text className="text-black dark:text-white">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <Text className="text-black dark:text-white">Error: {error.message}</Text>
      </View>
    );
  }
  console.log("eeeeeeeeeeeeeeeeeeee")

  if(data)
    console.log(data)

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      <FlatList
        data={data?.items}
        keyExtractor={(item) => item.tournamentId.toString()}
        renderItem={({ item }: { item: TournamentDto }) => (
          <View className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-black dark:text-white">{item.sport}</Text>
            <Text className="text-black dark:text-white">{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}