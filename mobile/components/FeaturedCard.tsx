import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Link, Href } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Animated, { FadeInDown } from 'react-native-reanimated'

export default function FeaturedCard({ 
  title, 
  description, 
  icon, 
  link, 
  delay 
}: {
  title: string
  description: string
  icon: string
  link: Href
  delay: number
}) {
  return (
    <Link href={link} asChild>
      <Pressable>
        <Animated.View 
          entering={FadeInDown.delay(delay)}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl mb-4 shadow-sm"
        >
          <View className="flex-row items-center mb-2">
            <Ionicons name={icon as any} size={24} className="text-blue-500" />
            <Text className="text-lg font-bold ml-2 text-gray-800 dark:text-white">
              {title}
            </Text>
          </View>
          <Text className="text-gray-600 dark:text-gray-300">{description}</Text>
        </Animated.View>
      </Pressable>
    </Link>
  )
}