import React, { useContext, useEffect } from 'react';
import { ReservationContext, ReservationListsResponse, ReservationScheduleProps, useGetWeekSchedule } from "../../reservationsService";
import { CircularProgress } from '@mui/material';
import styles from "./ReservationsWeek.module.scss";

const ReservationsWeek: React.FC<ReservationScheduleProps> = ({ date, objectId }) => {
    const weekSchedule = useGetWeekSchedule(date, objectId);
    const reservationContext = useContext(ReservationContext);

    useEffect(() => {
        // Sprawdzamy, czy selectedHours jest puste, jeśli tak, resetujemy selectedDate
        if (reservationContext?.selectedHours.length === 0) {
            reservationContext?.setSelectedDate('');
        }
    }, [reservationContext?.selectedHours]);

    const handleHourClick = (hour: string, date: string) => {
        // Jeśli selectedDate jest pustym stringiem, oznacza to, że użytkownik wybiera datę
        if (reservationContext?.selectedDate === '') {
            // Jeśli kliknięta godzina jest zielona (wolna), ustawiamy selectedDate na tę datę
            reservationContext?.setSelectedDate(date);
            reservationContext?.addSelectedHour(hour);
        } else {
            // Jeśli selectedDate jest już ustawiony, sprawdzamy, czy kliknięta data jest zgodna z selectedDate
            if (date === reservationContext?.selectedDate) {
                // Sprawdzamy, czy zaznaczone godziny sąsiednie
                const isAdjacent = reservationContext.selectedHours.some(selectedHour => {
                    const selectedHourInt = parseInt(selectedHour.split(":")[0], 10); // Konwertujemy godziny na liczby
                    const hourInt = parseInt(hour.split(":")[0], 10); // Robimy to samo z nową godziną
                    return Math.abs(selectedHourInt - hourInt) === 1; // Godziny sąsiednie (różnica 1 godzina)
                });

                if (reservationContext?.selectedHours.includes(hour)) {
                    // Jeśli godzina jest już zaznaczona, usuwamy ją
                    reservationContext?.removeSelectedHour(hour);
                } else {
                    // Jeśli godzina nie była zaznaczona, dodajemy ją, tylko jeśli jest sąsiednia do zaznaczonej
                    if (reservationContext.selectedHours.length === 0 || isAdjacent) {
                        reservationContext?.addSelectedHour(hour);
                    }
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
                                            tileColor = 'black';
                                        else if (hourStr < daySchedule.reservationsStart || hourStr >= daySchedule.reservationsEnd)
                                            tileColor = 'gray';
                                        else if (daySchedule.reservedHours.includes(hourStr))
                                            tileColor = 'red';
                                        // else if (daySchedule.freeHours.includes(hourStr))
                                        //     tileColor = 'green';
                                        else if (daySchedule.freeHours.includes(hourStr)) {
                                            // Pierwszy etap: jeśli brak zaznaczonej godziny, wszystkie godziny są dostępne
                                            if (reservationContext?.selectedHours.length === 0) {
                                                tileColor = 'green';
                                            } else {
                                                // Drugi etap: sprawdzamy, czy godzina jest sąsiednia do zaznaczonej
                                                const isAdjacent = reservationContext?.selectedHours.some(selectedHour => {
                                                    const selectedHourInt = parseInt(selectedHour.split(":")[0], 10);
                                                    const hourInt = parseInt(hourStr.split(":")[0], 10);
                                                    return Math.abs(selectedHourInt - hourInt) === 1;
                                                });
                                                // Jeśli godzina jest sąsiednia, zmieniamy kolor na zielony, w przeciwnym razie ciemnozielony
                                                tileColor = isAdjacent && daySchedule.date === reservationContext?.selectedDate ? 'green' : 'darkgreen';
                                            }
                                        }


                                        if ((tileColor === 'green' || tileColor === 'darkgreen') && reservationContext?.selectedHours.includes(hourStr) && reservationContext?.selectedDate === daySchedule.date) {
                                            tileColor = 'blue'; // Zmiana koloru dla zaznaczonej godziny
                                        }

                                        return (
                                            <div
                                                key={hour}
                                                style={{ width: '38px', height: '38px', backgroundColor: tileColor, margin: '4px', cursor: 'pointer', borderRadius:'6px' }}
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