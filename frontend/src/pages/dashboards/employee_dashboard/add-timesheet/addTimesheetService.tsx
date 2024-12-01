import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../../../../config/axiosConfig";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse";
import { ObjectTypeDto } from "../../../../shared/types/models/objectType";
import { CreateReservationTimesheetData, ReservationTimesheetDto, UpdateReservationTimesheetData } from "../../../../shared/types/models/reservationTimesheet";
import { PaginatedResult } from "../../../../shared/types/pagination/pagination";

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

//fetching all timesheets
const fetchPaginatedTimesheets = async (page: number, pageSize: number): Promise<PaginatedResult<ReservationTimesheetDto>> => {
    const response = await axiosInstance.get<PaginatedResult<ReservationTimesheetDto>>('/reservation-timesheets/all-paginated', {
        params: { page, pageSize },
    });
    return response.data;
};

export const useGetPaginatedTimesheets = (page: number, pageSize: number) => {
    return useQuery<PaginatedResult<ReservationTimesheetDto>>({
        queryKey: ['paginatedTimesheets', page],
        queryFn: () => fetchPaginatedTimesheets(page, pageSize),
        placeholderData: (prev) => prev,
    });
};

//update timesheet
const updateReservationTimesheet = async (updateData: UpdateReservationTimesheetData) => {
    const res = await axiosInstance.put(`/reservation-timesheets/update`, updateData);
    return res.data;
};

export const useUpdateReservationTimesheet = () => {
    return useMutation({
        mutationFn: updateReservationTimesheet,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data);
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error);
        },
    });
};