import axiosInstance from "@/config/axiosConfig";
import { ApiSuccessResponse, ApiErrorResponse } from "@/shared/types/api/apiResponse";
import { ReservationDto } from "@/shared/types/models/reservation";
import { PaginatedResult } from "@/shared/types/pagination/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

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