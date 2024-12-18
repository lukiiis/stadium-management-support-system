import { View, Text, ScrollView, ImageBackground } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import FeaturedCard from '@/components/FeaturedCard'

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1">
        <ImageBackground
          source={require('@/assets/images/hero-bg.jpg')}
          className="h-80"
        >
          <View className="h-full bg-black/40 px-4 justify-center">
            <Animated.View entering={FadeIn}>
              <Text className="text-5xl font-bold text-white">
                SMSS
              </Text>
              <Text className="text-xl text-gray-100 mt-4 max-w-[300px]">
                Your one-stop platform for sports venue management
              </Text>
            </Animated.View>
          </View>
        </ImageBackground>

        <View className="px-4">
          <Animated.View
            entering={FadeInDown.delay(200)}
            className="flex-row justify-between -mt-10 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <View className="items-center">
              <Text className="text-3xl font-bold text-blue-500">50+</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">Venues</Text>
            </View>
            <View className="items-center border-x border-gray-200 dark:border-gray-700 px-8">
              <Text className="text-3xl font-bold text-green-500">100+</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">Events</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-purple-500">1000+</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">Users</Text>
            </View>
          </Animated.View>

          <View className="mt-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-semibold text-gray-800 dark:text-white">
                Quick Actions
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#6B7280" />
            </View>

            <FeaturedCard
              title="Book a Venue"
              description="Find and reserve premium sports facilities instantly"
              icon="calendar"
              link="/reservations"
              delay={300}
            />
            <FeaturedCard
              title="Join Tournaments"
              description="Participate in exciting sports competitions"
              icon="trophy"
              link="/tournaments"
              delay={400}
            />
            <FeaturedCard
              title="Explore Facilities"
              description="Discover world-class sports venues near you"
              icon="map"
              link="/facilities"
              delay={500}
            />
          </View>

          <View className="mt-8 mb-6">
            <Text className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Latest Updates
            </Text>
            <Animated.View
              entering={FadeInDown.delay(600)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <View className="border-l-4 border-blue-500 pl-4 mb-4">
                <Text className="text-sm text-blue-500 font-medium">NEW</Text>
                <Text className="text-base font-medium text-gray-800 dark:text-white">
                  Summer Tournament Series
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Registration now open for multiple sports categories
                </Text>
              </View>
              <View className="border-l-4 border-green-500 pl-4">
                <Text className="text-sm text-green-500 font-medium">OFFER</Text>
                <Text className="text-base font-medium text-gray-800 dark:text-white">
                  Early Bird Discount
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Get 20% off on weekend bookings
                </Text>
              </View>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}