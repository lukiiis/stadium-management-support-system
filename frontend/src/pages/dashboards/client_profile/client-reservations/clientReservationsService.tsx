import { useMutation, useQuery } from "@tanstack/react-query";
import { PaginatedResult } from "../../../../shared/types/pagination/pagination";
import axiosInstance from "../../../../config/axiosConfig";
import { AxiosError } from "axios";
import { ReservationDto } from "../../../../shared/types/models/reservation";
import { ApiSuccessResponse, ApiErrorResponse } from "../../../../shared/types/api/apiResponse";

// get paginated reservations
export const useGetPaginatedUserReservations = (userId: number, page: number, pageSize: number) => {
    return useQuery<PaginatedResult<ReservationDto>>({
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

// pay for reservation
export const useReservationPayment = () => {
    return useMutation({
        mutationFn: reservationPayment,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },
    })
}

const reservationPayment = async (reservationId: number) => {
    const res = await axiosInstance.put(`/reservations/update-payment-status/${reservationId}`)
    return res.data;
}