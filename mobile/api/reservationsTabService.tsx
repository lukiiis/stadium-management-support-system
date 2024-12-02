import axiosInstance from "@/config/axiosConfig";
import { ApiErrorResponse, ApiSuccessResponse } from "@/shared/types/api/apiResponse";
import { ObjectTypeDto } from "@/shared/types/models/objectType";
import { CreateReservationData, ReservationListsResponse } from "@/shared/types/models/reservation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { createContext } from "react";

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
export const useCreateReservation = () => {
    return useMutation({
        mutationFn: createReservationPost,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },   
    })
}

export const createReservationPost = async (reservationData: CreateReservationData) => {
    const res = await axiosInstance.post('/reservations/create', reservationData);
    return res.data;
}