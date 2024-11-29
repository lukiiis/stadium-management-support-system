import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createContext } from "react";
import axiosInstance from "../../config/axiosConfig";
import { ObjectTypeDto } from "../../shared/types/models/objectType";

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
    const response = await axiosInstance.get<ReservationListsResponse>(`/reservations/reservation-schedule-day`, {
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
    const response = await axiosInstance.get<ReservationListsResponse[]>(`/reservations/reservation-schedule-week`, {
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

//fetching ObjectTypes
const fetchObjectTypes = async (): Promise<ObjectTypeDto[]> => {
    const response = await axiosInstance.get('/object-types/get-all');
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
    payNow: boolean;
    setPayNow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const calculateTimeRangeAndPrice = (selectedHours: string[]) => {
    if (selectedHours.length === 0) {
        return { startTime: null, endTime: null };
    }
    const sortedHours = selectedHours.slice().sort();

    const startTime = sortedHours[0];

    const lastHour = sortedHours[sortedHours.length - 1];
    const [hour, minute, second] = lastHour.split(':').map(Number);

    const adjustedEndHour = (hour + 1).toString().padStart(2, '0');
    const endTime = `${adjustedEndHour}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;

    const price = selectedHours.length * 50;

    return { startTime, endTime, price };
};

// ------------- CREATE RESERVATION -------------------
export interface CreateReservationData {
    reservationStart: string | null;
    reservationEnd: string | null;
    reservationDate: string;
    price: number | undefined;
    objectId: number | null;
    userId: number | null;
    isPaid: boolean;
}

export interface CreateReservationResponse {
    message: string;
}

export interface CreateReservationErrorResponse {
    error: string
}

export const useCreateReservation = () => {
    return useMutation({
        mutationFn: createReservationPost,
        onSuccess: (data: CreateReservationResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<CreateReservationErrorResponse>) => {
            console.log(error)
        },   
    })
}

export const createReservationPost = async (reservationData: CreateReservationData) => {
    const res = await axiosInstance.post('/reservations/create', reservationData);
    return res.data;
}