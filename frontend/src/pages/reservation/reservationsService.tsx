import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext } from "react";

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

//fetching schedule for one day
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


//fetching schedule for one week
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


// --------------------- OBJECT TYPES ------------------------
export interface ObjectTypeDto {
    objectId: number;
    type: string;
    description: string;
    imageUrl: string;
}

//fetching ObjectTypes
const fetchObjectTypes = async (): Promise<ObjectTypeDto[]> => {
    const response = await axios.get('https://localhost:7234/api/object-types/get-all');
    return response.data;
};

export const useGetAllObjectTypes = () => {
    return useQuery<ObjectTypeDto[]>({
        queryKey: ['objectTypes'],
        queryFn: fetchObjectTypes,
    });
}

// -------------- CONTEXT FOR RESERVED HOURS -------------
interface ReservationContextType {
    selectedDate: string;
    setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
    selectedHours: string[];
    addSelectedHour: (hour: string) => void;
    removeSelectedHour: (hour: string) => void;
}

export const ReservationContext = createContext<ReservationContextType | undefined>(undefined);