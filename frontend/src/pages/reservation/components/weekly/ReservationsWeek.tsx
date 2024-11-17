import React, { useContext } from 'react';
import { ReservationContext, ReservationListsResponse, ReservationScheduleProps, useGetWeekSchedule } from "../../reservationsService";
import { CircularProgress } from '@mui/material';
import styles from "./ReservationsWeek.module.scss";

const ReservationsWeek: React.FC<ReservationScheduleProps> = ({ date, objectId }) => {
    const weekSchedule = useGetWeekSchedule(date, objectId);
    const reservationContext = useContext(ReservationContext);

    const handleHourClick = (hour: string, date: string) => {
        // Jeśli selectedDate jest pustym stringiem, oznacza to, że użytkownik wybiera datę
        if (reservationContext?.selectedDate === '') {
            // Jeśli kliknięta godzina jest zielona (wolna), ustawiamy selectedDate na tę datę
            reservationContext?.setSelectedDate(date);
            reservationContext?.addSelectedHour(hour);
        } else {
            // Jeśli selectedDate jest już ustawiony, sprawdzamy, czy kliknięta data jest zgodna z selectedDate
            if (date === reservationContext?.selectedDate) {
                if (reservationContext?.selectedHours.includes(hour)) {
                    // Jeśli godzina jest już zaznaczona, usuwamy ją
                    reservationContext?.removeSelectedHour(hour);
                    // Jeśli wszystkie godziny zostały odznaczone, resetujemy selectedDate na pusty string
                    if (reservationContext.selectedHours.length === 0) {
                        reservationContext?.setSelectedDate('');
                    }
                } else {
                    // Jeśli godzina nie była zaznaczona, dodajemy ją
                    reservationContext?.addSelectedHour(hour);
                }
            }
        }
    };
    console.log(reservationContext);

    return (
        <div className={styles.main}>
            {weekSchedule.data ? (
                <div className={styles.daysList}>
                    {weekSchedule.data.map((daySchedule: ReservationListsResponse, index: number) => {
                        return (
                            <div key={index} className={styles.hoursList}>
                                <h3>{new Date(daySchedule.date).toLocaleDateString()}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    {Array.from({ length: 17 }, (_, i) => 7 + i).map((hour) => {
                                        const hourStr = (hour).toString().padStart(2, '0') + ':00:00';

                                        let tileColor = 'gray';

                                        if (daySchedule.isTournament)
                                            tileColor = 'gray';
                                        else if (hourStr < daySchedule.reservationsStart || hourStr >= daySchedule.reservationsEnd)
                                            tileColor = 'gray';
                                        else if (daySchedule.reservedHours.includes(hourStr))
                                            tileColor = 'red';
                                        else if (daySchedule.freeHours.includes(hourStr))
                                            tileColor = 'green';

                                        if (tileColor === 'green' && reservationContext?.selectedHours.includes(hourStr) && reservationContext?.selectedDate === daySchedule.date) {
                                            tileColor = 'blue'; // Zmiana koloru dla zaznaczonej godziny
                                        }

                                        return (
                                            <div
                                                key={hour}
                                                style={{ width: '38px', height: '38px', backgroundColor: tileColor, margin: '4px', cursor: 'pointer' }}
                                                onClick={() => (tileColor === 'green' || tileColor === 'blue') && handleHourClick(hourStr, daySchedule.date)} // Tylko dla zielonych (wolnych godzin)
                                            >
                                                {/* {hour} */}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (<CircularProgress />)}
        </div>
    );
};

export default ReservationsWeek;