import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiErrorResponse, ApiSuccessResponse, ObjectTypeDto } from "../../../../shared/interfaces";
import { PaginatedResult } from "../../../../shared/pagination";
import axiosInstance from "../../../../config/axiosConfig";
import { AxiosError } from "axios";

// get paginated reservations
export interface ReservationData {
    reservationId: number,
    reservationStart: string;
    reservationEnd: string;
    reservationDate: string;
    paymentStatus: string,
    reservedAt: string,
    price: number;
    objectType: ObjectTypeDto;
}

export const useGetPaginatedUserReservations = (userId: number, page: number, pageSize: number) => {
    return useQuery<PaginatedResult<ReservationData>>({
        queryKey: ['userReservations', userId, page],
        queryFn: () => fetchPaginatedUserReservations(userId, page, pageSize),
        placeholderData: (prev) => prev,
    });
}


const fetchPaginatedUserReservations = async (userId: number, page: number, pageSize: number) => {
    const res = await axiosInstance.get('/reservations/users-reservations-paginated', {
        params: { userId, page, pageSize },
    });
    return res.data;
};

//cancel reservation
export const useCancelReservation = () => {
    return useMutation({
        mutationFn: cancelReservation,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },
    })
}

const cancelReservation = async (reservationId: number) => {
    const res = await axiosInstance.delete('/reservations/delete', {
        params: { reservationId }
    });
    return res.data;
}