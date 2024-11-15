import React from 'react';
import { ReservationScheduleProps, useGetDaySchedule } from "../reservationsService";

const ReservationsDay: React.FC<ReservationScheduleProps> = ({ date, objectId }) => {
    const daySchedule = useGetDaySchedule(date, objectId);
    // console.log(daySchedule.data);
    const renderHourTile = (hour: number) => {
        const hourStr = hour.toString().padStart(2, '0') + ':00:00';
        // console.log(hourStr)

        let tileColor = 'gray';

        daySchedule.data ? () => {
            console.log("gowno")
            if (daySchedule.data.isTournament) {
                tileColor = 'gray';
            } else if (hourStr < daySchedule.data.reservationsStart || hourStr >= daySchedule.data?.reservationsEnd) {
                tileColor = 'gray';
            } else if (daySchedule.data.reservedHours.includes(hourStr)) {
                tileColor = 'red';
            } else if (daySchedule.data.freeHours.includes(hourStr)) {
                tileColor = 'green';
            }
        } : {}

        return (
            <div key={hour} style={{ width: '50px', height: '50px', backgroundColor: tileColor, margin: '4px' }}>
                {hourStr}
            </div>
        );
    };

    return (
        <div>

            {daySchedule.data ? (
                <div>
                    <h3>{new Date(daySchedule.data?.date).toLocaleDateString()}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {Array.from({ length: 17 }, (_, i) => 7 + i).map((hour) => {
                            const hourStr = (hour).toString().padStart(2, '0') + ':00:00';
                            return (
                                daySchedule.data.reservedHours.includes(hourStr) ? <div>reserved</div> : <div>free</div>
                            )
                        })}
                    </div>
                </div>
            ) : (<div></div>)}

        </div>
    );
};

export default ReservationsDay;