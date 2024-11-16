import React from 'react';
import { ReservationListsResponse, ReservationScheduleProps, useGetWeekSchedule } from "../../reservationsService";
import { CircularProgress } from '@mui/material';
import styles from "./ReservationsWeek.module.scss";

const ReservationsWeek: React.FC<ReservationScheduleProps> = ({ date, objectId }) => {
    const weekSchedule = useGetWeekSchedule(date, objectId);
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
        
                                    return (
                                        <div key={hour} style={{ width: '38px', height: '38px', backgroundColor: tileColor, margin: '4px' }}>
                                            {/* {hour} */}
                                        </div>
                                    )
                                })}
                            </div>
                            </div>
                        )
                    })}
                </div>
            ) : (<CircularProgress/>)}
        </div>
    );
};

export default ReservationsWeek;