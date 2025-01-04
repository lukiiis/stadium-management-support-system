import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')
const TILE_SIZE = (width - 80) / 4 // 4 tiles per row

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
  onPreviousDay: () => void
  onNextDay: () => void
  isToday: boolean
}

export default function TimeSheet({ date, schedule, selectedHours, onHourSelect, isToday, onNextDay, onPreviousDay }: TimeSheetProps) {
  const getHourIcon = (status: string) => {
    switch (status) {
      case 'green': return 'checkmark-circle-outline'
      case 'blue': return 'checkmark-circle'
      case 'red': return 'close-circle-outline'
      case 'black': return 'time-outline'
      case 'brown': return 'trophy-outline'
      default: return 'ban-outline'
    }
  }

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

  const renderLegend = () => (
    <Animated.View
      entering={FadeInDown.delay(200)}
      style={styles.legend}
    >
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.green]} />
        <Text style={styles.legendText}>Available</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.blue]} />
        <Text style={styles.legendText}>Selected</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.red]} />
        <Text style={styles.legendText}>Booked</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, styles.brown]} />
        <Text style={styles.legendText}>Tournament</Text>
      </View>
      <View style={styles.legendItem}>
      <View style={[styles.legendDot, styles.black]} />
        <View style={[styles.legendDot, styles.gray]} />
        <Text style={styles.legendText}>Unavailable</Text>
      </View>
    </Animated.View>
  )

  const renderTimeSlot = (hour: number) => {
    const hourStr = `${hour.toString().padStart(2, '0')}:00:00`
    const status = getHourStatus(hourStr)
    const isSelectable = status === 'green' || status === 'blue'
    const icon = getHourIcon(status)

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
        <Ionicons
          name={icon}
          size={16}
          color={status === 'gray' ? '#666' : '#fff'}
          style={styles.tileIcon}
        />
      </TouchableOpacity>
    )
  }

  return (
    <Animated.View
      entering={FadeInDown}
      style={styles.container}
    >
      <View style={styles.dateHeader}>
        <TouchableOpacity
          onPress={onPreviousDay}
          disabled={isToday}
          style={styles.dateButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={isToday ? '#9CA3AF' : '#3b82f6'}
          />
        </TouchableOpacity>

        <View style={styles.dateInfo}>
          <Ionicons name="calendar-outline" size={24} color="#3b82f6" />
          <Text style={styles.dateText}>
            {new Date(date).toLocaleDateString() === new Date().toLocaleDateString()
              ? 'Today'
              : new Date(date).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onNextDay}
          style={styles.dateButton}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color="#3b82f6"
          />
        </TouchableOpacity>
      </View>

      {renderLegend()}

      <View style={styles.periodIndicator}>
        <Ionicons name="time-outline" size={20} color="#666" />
        <Text style={styles.periodText}>
          {schedule.reservationsStart.split(':')[0]}:00 - {schedule.reservationsEnd.split(':')[0]}:00
        </Text>
      </View>

      <View style={styles.tilesContainer}>
        {Array.from({ length: 17 }, (_, i) => i + 7).map(renderTimeSlot)}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 8,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  legend: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  periodIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
    gap: 4,
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tileText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tileIcon: {
    marginTop: 4,
  },
  lightText: {
    color: '#fff',
  },
  darkText: {
    color: '#666',
  },
  green: {
    backgroundColor: '#22c55e',
  },
  darkgreen: {
    backgroundColor: '#15803d',
  },
  blue: {
    backgroundColor: '#3b82f6',
  },
  gray: {
    backgroundColor: '#f3f4f6',
  },
  red: {
    backgroundColor: '#ef4444',
  },
  black: {
    backgroundColor: '#1f2937',
  },
  brown: {
    backgroundColor: '#78350f',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
})