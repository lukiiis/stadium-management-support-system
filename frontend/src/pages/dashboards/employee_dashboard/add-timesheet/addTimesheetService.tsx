import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../../../../config/axiosConfig";

export interface CreateReservationTimesheetData {
    date: string,
    startTime: string,
    endTime: string,
    objectId: number | null,
}

export interface CreateReservationTimesheetResponse {
    message: string,
}

export interface CreateReservationTimesheetErrorResponse {
    error: string,
}

export const useCreateReservationTimesheet = () => {
    return useMutation({
        mutationFn: createReservationTimesheetPost,
        onSuccess: (data: CreateReservationTimesheetResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<CreateReservationTimesheetErrorResponse>) => {
            console.log(error)
        },   
    })
}

const createReservationTimesheetPost = async (reservationTimesheetData: CreateReservationTimesheetData) => {
    const res = await axiosInstance.post('/reservation-timesheets/create', reservationTimesheetData);
    return res.data;
}


// fetching objects to get their id's
export interface ObjectType {
    objectId: number;
    type: string;
    description: string;
    imageUrl: string;
}

const fetchAllObjectTypes = async (): Promise<ObjectType[]> => {
    const response = await axiosInstance.get<ObjectType[]>(`/object-types/get-all`);
    return response.data;
};

export const useGetObjectTypes = () => {
    return useQuery<ObjectType[]>({
        queryKey:['objectTypes'],
        queryFn: fetchAllObjectTypes,
    });
}