import axiosInstance from "@/config/axiosConfig";
import { ApiSuccessResponse, ApiErrorResponse } from "@/shared/types/api/apiResponse";
import { ReservationDto } from "@/shared/types/models/reservation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

// get paginated reservations
export const useGetUserReservations = (userId: number) => {
    return useQuery<ReservationDto[]>({
        queryKey: ['userReservations', userId],
        queryFn: () => fetchUserReservations(userId),
        placeholderData: (prev) => prev,
    });
}

const fetchUserReservations = async (userId: number) => {
    const res = await axiosInstance.get('/reservations/users-reservations', {
        params: { userId },
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