import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { ReservationListsResponse } from '@/shared/types/models/reservation';
import { useGetDaySchedule } from '@/api/reservationsTabService';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ReservationsScreen() {
  const [formattedDate, setFormattedDate] = useState<string>(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
  );

  const { data, isLoading, error } = useGetDaySchedule(formattedDate, 1);
  // context for selecting hours
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const addSelectedHour = (hour: string) => {
    setSelectedHours((prev) => [...prev, hour]);
  };

  const removeSelectedHour = (hour: string) => {
    setSelectedHours((prev) => prev.filter((h) => h !== hour));
  };

  const handleHourClick = (hour: string, date: string) => {
    if (selectedDate === '') {
      setSelectedDate(date);
      addSelectedHour(hour);
    } else if (date === selectedDate) {
      const isAdjacent = selectedHours.some(selectedHour => {
        const selectedHourInt = parseInt(selectedHour.split(":")[0], 10);
        const hourInt = parseInt(hour.split(":")[0], 10);
        return Math.abs(selectedHourInt - hourInt) === 1;
      });

      if (selectedHours.includes(hour)) {
        const sortedHours = selectedHours.slice().sort();
        const currentIndex = sortedHours.indexOf(hour);
        const prevHour = sortedHours[currentIndex - 1];
        const nextHour = sortedHours[currentIndex + 1];

        if (prevHour && nextHour) {
          const [prevH] = prevHour.split(':').map(Number);
          const [currH] = hour.split(':').map(Number);
          const [nextH] = nextHour.split(':').map(Number);

          if (prevH === currH - 1 && nextH === currH + 1) {
            return;
          }
        }

        removeSelectedHour(hour);
      } else if (selectedHours.length === 0 || isAdjacent) {
        addSelectedHour(hour);
      }
    }
  };

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

  return (
    <div className={styles.main}>
      {data && (
        <>
          <div className={styles.daysList}>
            <div className={styles.hoursList}>
              <h3>
                {new Date(data.date).toLocaleDateString() === new Date().toLocaleDateString()
                  ? 'Today'
                  : new Date(data.date).toLocaleDateString()}
              </h3>
              <div>
                {Arr</View>ay.from({ length: 17 }, (_, i) => 7 + i).map((hour) => {
                  const hourStr = (hour).toString().padStart(2, '0') + ':00:00';
                  let tileColor = 'gray';

                  const currentDate = new Date();
                  const currentHour = currentDate.getHours();
                  const isToday = new Date(data.date).toLocaleDateString() === currentDate.toLocaleDateString();

                  if (isToday && hour < currentHour) {
                    tileColor = 'black';
                  } else if (data.isTournament) {
                    tileColor = 'brown';
                  } else if (hourStr < data.reservationsStart || hourStr >= data.reservationsEnd) {
                    tileColor = 'gray';
                  } else if (data.reservedHours.includes(hourStr)) {
                    tileColor = 'red';
                  } else if (data.freeHours.includes(hourStr)) {
                    if (selectedHours.length === 0) {
                      tileColor = 'green';
                    } else {
                      const isAdjacent = selectedHours.some(selectedHour => {
                        const selectedHourInt = parseInt(selectedHour.split(":")[0], 10);
                        const hourInt = parseInt(hourStr.split(":")[0], 10);
                        return Math.abs(selectedHourInt - hourInt) === 1;
                      });
                      tileColor = isAdjacent && data.date === selectedDate
                        ? 'green'
                        : 'darkgreen';
                    }
                  }

                  if ((tileColor === 'green' || tileColor === 'darkgreen') &&
                    selectedHours.includes(hourStr) &&
                    selectedDate === data.date) {
                    tileColor = 'blue';
                  }

                  return (
                    <div
                      key={hour}
                      className={`${styles.hourTile} ${styles[tileColor]}`}
                      onClick={() => (tileColor === 'green' || tileColor === 'blue') && handleHourClick(hourStr, daySchedule.date)}
                    >
                      {`${hour}:00`}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}