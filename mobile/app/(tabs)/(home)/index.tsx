// app/(tabs)/(home)/index.tsx
import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import FeaturedCard from '@/components/FeaturedCard'

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <Animated.View 
          entering={FadeIn}
          className="py-8"
        >
          <Text className="text-4xl font-bold text-gray-800 dark:text-white">
            Welcome to
          </Text>
          <Text className="text-4xl font-bold text-blue-500 mt-1">
            Stadium Manager
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
            Book venues, join tournaments, and more
          </Text>
        </Animated.View>

        {/* Featured Cards */}
        <View className="py-4">
          <Animated.Text 
            entering={FadeInDown.delay(100)}
            className="text-xl font-semibold mb-4 text-gray-800 dark:text-white"
          >
            Quick Actions
          </Animated.Text>

          <FeaturedCard
            title="Book a Venue"
            description="Browse and reserve sports facilities for your next game or practice session"
            icon="calendar"
            link="/reservations"
            delay={200}
          />

          <FeaturedCard
            title="Join Tournaments"
            description="Discover and participate in upcoming tournaments and competitions"
            icon="trophy"
            link="/tournaments"
            delay={300}
          />

          <FeaturedCard
            title="Explore Facilities"
            description="View our state-of-the-art sports facilities and amenities"
            icon="cube"
            link="/objects"
            delay={400}
          />
        </View>

        {/* Stats Section */}
        <Animated.View 
          entering={FadeInDown.delay(500)}
          className="flex-row justify-between bg-blue-500 p-6 rounded-xl mb-6"
        >
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">50+</Text>
            <Text className="text-white opacity-80">Venues</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">100+</Text>
            <Text className="text-white opacity-80">Events</Text>
          </View>
          <View className="items-center">
            <Text className="text-white text-2xl font-bold">1000+</Text>
            <Text className="text-white opacity-80">Users</Text>
          </View>
        </Animated.View>

        {/* About Section */}
        <Animated.View 
          entering={FadeInDown.delay(600)}
          className="mb-8"
        >
          <Text className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            About Us
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 leading-6">
            We provide a comprehensive platform for managing sports facilities,
            organizing tournaments, and connecting sports enthusiasts. Our mission
            is to make sports facility management and booking as seamless as
            possible.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}