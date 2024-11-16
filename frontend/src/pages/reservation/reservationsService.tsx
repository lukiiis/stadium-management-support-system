import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ReservationListsResponse {
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

const fetchDayScheduleData = async (date: string, objectId: number): Promise<ReservationListsResponse> => {
    const response = await axios.get<ReservationListsResponse>(`https://localhost:7234/api/reservations/reservation-schedule-day`, {
        params: { date, objectId },
    });
    return response.data;
};

export const useGetDaySchedule = (date: string, objectId: number) => {
    return useQuery<ReservationListsResponse>({
        queryKey:['reservationDaySchedule', date, objectId],
        queryFn: () => fetchDayScheduleData(date, objectId),
    });
}



const fetchWeekScheduleData = async (startDate: string, objectId: number): Promise<ReservationListsResponse[]> => {
    const response = await axios.get<ReservationListsResponse[]>(`https://localhost:7234/api/reservations/reservation-schedule-week`, {
        params: { startDate, objectId },
    });
    return response.data;
};

export const useGetWeekSchedule = (startDate: string, objectId: number) => {
    return useQuery<ReservationListsResponse[]>({
        queryKey:['reservationDaySchedule', startDate, objectId],
        queryFn: () => fetchWeekScheduleData(startDate, objectId),
    });
}