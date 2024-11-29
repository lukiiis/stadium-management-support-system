import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../../../../config/axiosConfig";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse";
import { ObjectTypeDto } from "../../../../shared/types/models/objectType";
import { CreateReservationTimesheetData } from "../../../../shared/types/models/reservationTimesheet";

export const useCreateReservationTimesheet = () => {
    return useMutation({
        mutationFn: createReservationTimesheetPost,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },   
    })
}

const createReservationTimesheetPost = async (reservationTimesheetData: CreateReservationTimesheetData) => {
    const res = await axiosInstance.post('/reservation-timesheets/create', reservationTimesheetData);
    return res.data;
}


// fetching objects to get their id's
const fetchAllObjectTypes = async (): Promise<ObjectTypeDto[]> => {
    const response = await axiosInstance.get<ObjectTypeDto[]>(`/object-types/get-all`);
    return response.data;
};

export const useGetObjectTypes = () => {
    return useQuery<ObjectTypeDto[]>({
        queryKey:['objectTypes'],
        queryFn: fetchAllObjectTypes,
    });
}