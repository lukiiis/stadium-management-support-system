import React from 'react';
import { ReservationScheduleProps, useGetDaySchedule } from "../../reservationsService";
import { CircularProgress } from '@mui/material';

const ReservationsDay: React.FC<ReservationScheduleProps> = ({ date, objectId }) => {
    const daySchedule = useGetDaySchedule(date, objectId);

    return (
        <div>
            {daySchedule.data ? (
                <div>
                    <h3>{new Date(daySchedule.data?.date).toLocaleDateString()}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {Array.from({ length: 17 }, (_, i) => 7 + i).map((hour) => {
                            const hourStr = (hour).toString().padStart(2, '0') + ':00:00';

                            let tileColor = 'gray';

                            if (daySchedule.data.isTournament)
                                tileColor = 'gray';
                            else if (hourStr < daySchedule.data.reservationsStart || hourStr >= daySchedule.data?.reservationsEnd)
                                tileColor = 'gray';
                            else if (daySchedule.data.reservedHours.includes(hourStr))
                                tileColor = 'red';
                            else if (daySchedule.data.freeHours.includes(hourStr))
                                tileColor = 'green';

                            return (
                                <div key={hour} style={{ width: '50px', height: '50px', backgroundColor: tileColor, margin: '4px' }}>
                                    {/* {hour} */}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (<CircularProgress/>)}
        </div>
    );
};

export default ReservationsDay;