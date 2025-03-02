import React, { useContext, useEffect } from 'react';
import { ReservationContext, ReservationListsResponse, ReservationScheduleProps, useGetWeekSchedule } from "../../reservationsService";
import { CircularProgress } from '@mui/material';
import styles from "./ReservationsWeek.module.scss";

const Legend = () => (
    <div className={styles.legend}>
        {[
            { color: 'green', label: 'Available' },
            { color: 'blue', label: 'Selected' },
            { color: 'red', label: 'Booked' },
            { color: 'gray', label: 'Unavailable' },
            { color: 'black', label: 'Past' },
            { color: 'brown', label: 'Tournament' }
        ].map(({ color, label }) => (
            <div key={color} className={styles.legendItem}>
                <div className={styles.dot} style={{ backgroundColor: color }} />
                <span>{label}</span>
            </div>
        ))}
    </div>
);

const ReservationsWeek: React.FC<ReservationScheduleProps> = ({ date, objectId }) => {
    const weekSchedule = useGetWeekSchedule(date, objectId);
    const reservationContext = useContext(ReservationContext);

    useEffect(() => {
        if (reservationContext?.selectedHours.length === 0) {
            reservationContext?.setSelectedDate('');
        }
    }, [reservationContext?.selectedHours]);

    const handleHourClick = (hour: string, date: string) => {
        if (reservationContext?.selectedDate === '') {
            reservationContext?.setSelectedDate(date);
            reservationContext?.addSelectedHour(hour);
        } else if (date === reservationContext?.selectedDate) {
            const isAdjacent = reservationContext.selectedHours.some(selectedHour => {
                const selectedHourInt = parseInt(selectedHour.split(":")[0], 10);
                const hourInt = parseInt(hour.split(":")[0], 10);
                return Math.abs(selectedHourInt - hourInt) === 1;
            });

            if (reservationContext?.selectedHours.includes(hour)) {
                const sortedHours = reservationContext.selectedHours.slice().sort();
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

                reservationContext?.removeSelectedHour(hour);
            } else if (reservationContext.selectedHours.length === 0 || isAdjacent) {
                reservationContext?.addSelectedHour(hour);
            }
        }
    };

    return (
        <div className={styles.main}>
            {weekSchedule.data ? (
                <>
                    <Legend />
                    <div className={styles.daysList}>
                        {weekSchedule.data.map((daySchedule: ReservationListsResponse, index: number) => (
                            <div key={index} className={styles.hoursList}>
                                <h3>
                                    {new Date(daySchedule.date).toLocaleDateString() === new Date().toLocaleDateString()
                                        ? 'Today'
                                        : new Date(daySchedule.date).toLocaleDateString()}
                                </h3>

                                {Array.from({ length: 17 }, (_, i) => 7 + i).map((hour) => {
                                    const hourStr = (hour).toString().padStart(2, '0') + ':00:00';
                                    let tileColor = 'gray';

                                    const currentDate = new Date();
                                    const currentHour = currentDate.getHours();
                                    const isToday = new Date(daySchedule.date).toLocaleDateString() === currentDate.toLocaleDateString();

                                    if (isToday && hour < currentHour) {
                                        tileColor = 'black';
                                    } else if (daySchedule.isTournament) {
                                        tileColor = 'brown';
                                    } else if (hourStr < daySchedule.reservationsStart || hourStr >= daySchedule.reservationsEnd) {
                                        tileColor = 'gray';
                                    } else if (daySchedule.reservedHours.includes(hourStr)) {
                                        tileColor = 'red';
                                    } else if (daySchedule.freeHours.includes(hourStr)) {
                                        if (reservationContext?.selectedHours.length === 0) {
                                            tileColor = 'green';
                                        } else {
                                            const isAdjacent = reservationContext?.selectedHours.some(selectedHour => {
                                                const selectedHourInt = parseInt(selectedHour.split(":")[0], 10);
                                                const hourInt = parseInt(hourStr.split(":")[0], 10);
                                                return Math.abs(selectedHourInt - hourInt) === 1;
                                            });
                                            tileColor = isAdjacent && daySchedule.date === reservationContext?.selectedDate
                                                ? 'green'
                                                : 'darkgreen';
                                        }
                                    }

                                    if ((tileColor === 'green' || tileColor === 'darkgreen') &&
                                        reservationContext?.selectedHours.includes(hourStr) &&
                                        reservationContext?.selectedDate === daySchedule.date) {
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
                        ))}
                    </div>
                </>
            ) : (
                <CircularProgress />
            )}
        </div>

    );
};

export default ReservationsWeek;
