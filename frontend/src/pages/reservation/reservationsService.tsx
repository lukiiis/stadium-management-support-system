import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ReservationListsDayResponse {
    reservationsStart: string
    reservationsEnd: string
    freeHours: string[]
    reservedHours: string[]
    date: string
    isTournament: boolean
};

export interface ReservationScheduleProps {
    date: string;
    objectId: number;
};

const fetchScheduleData = async (date: string, objectId: number): Promise<ReservationListsDayResponse> => {
    const response = await axios.get<ReservationListsDayResponse>(`https://localhost:7234/api/reservations/reservation-schedule-day`, {
        params: { date, objectId },
    });
    return response.data;
};

export const useGetDaySchedule = (date: string, objectId: number) => {
    return useQuery<ReservationListsDayResponse>({
        queryKey:['reservationDaySchedule', date, objectId],
        queryFn: () => fetchScheduleData(date, objectId),
    });
}