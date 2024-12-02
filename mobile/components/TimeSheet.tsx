// components/TimeSheet.tsx
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')
const TILE_SIZE = (width - 80) / 4 // 4 tiles per row with padding

interface TimeSheetProps {
  date: string
  schedule: {
    date: string
    reservationsStart: string
    reservationsEnd: string
    freeHours: string[]
    reservedHours: string[]
    isTournament: boolean
  }
  selectedHours: string[]
  onHourSelect: (hour: string, date: string) => void
}

export default function TimeSheet({ date, schedule, selectedHours, onHourSelect }: TimeSheetProps) {
  const getHourStatus = (hourStr: string) => {
    const currentDate = new Date()
    const currentHour = currentDate.getHours()
    const hour = parseInt(hourStr.split(':')[0], 10)
    const isToday = new Date(date).toDateString() === currentDate.toDateString()

    if (isToday && hour < currentHour) return 'black'
    if (schedule.isTournament) return 'brown'
    if (hourStr < schedule.reservationsStart || hourStr >= schedule.reservationsEnd) return 'gray'
    if (schedule.reservedHours.includes(hourStr)) return 'red'
    if (selectedHours.includes(hourStr)) return 'blue'
    if (schedule.freeHours.includes(hourStr)) {
      if (selectedHours.length === 0) return 'green'
      const isAdjacent = selectedHours.some(selectedHour => {
        const selectedHourInt = parseInt(selectedHour.split(':')[0], 10)
        const hourInt = hour
        return Math.abs(selectedHourInt - hourInt) === 1
      })
      return isAdjacent ? 'green' : 'darkgreen'
    }
    return 'gray'
  }

  return (
    <Animated.View 
      entering={FadeInDown}
      style={styles.container}
    >
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>
          {new Date(date).toLocaleDateString() === new Date().toLocaleDateString()
            ? 'Today'
            : new Date(date).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.tilesContainer}>
        {Array.from({ length: 17 }, (_, i) => i + 7).map((hour) => {
          const hourStr = `${hour.toString().padStart(2, '0')}:00:00`
          const status = getHourStatus(hourStr)
          const isSelectable = status === 'green' || status === 'blue'

          return (
            <TouchableOpacity
              key={hour}
              onPress={() => isSelectable && onHourSelect(hourStr, date)}
              disabled={!isSelectable}
              style={[styles.tile, styles[status]]}
            >
              <Text style={[styles.tileText, status === 'gray' ? styles.darkText : styles.lightText]}>
                {`${hour}:00`}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateHeader: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: {
    fontSize: 12,
    fontWeight: '500',
  },
  lightText: {
    color: '#fff',
  },
  darkText: {
    color: '#333',
  },
  green: {
    backgroundColor: '#4caf50',
  },
  darkgreen: {
    backgroundColor: '#2e7d32',
  },
  blue: {
    backgroundColor: '#2196f3',
  },
  gray: {
    backgroundColor: '#e0e0e0',
  },
  red: {
    backgroundColor: '#be3228',
  },
  black: {
    backgroundColor: '#2e2e2e',
  },
  brown: {
    backgroundColor: '#502626',
  },
})