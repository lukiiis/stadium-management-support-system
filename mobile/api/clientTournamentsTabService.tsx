import axiosInstance from "@/config/axiosConfig";
import { ApiSuccessResponse, ApiErrorResponse } from "@/shared/types/api/apiResponse";
import { UsersTournaments, LeaveTournamentData } from "@/shared/types/models/userTournament";
import { PaginatedResult } from "@/shared/types/pagination/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

// get joined tournaments paginated
export const useGetPaginatedUserTournaments = (userId: number, page: number, pageSize: number) => {
    return useQuery<PaginatedResult<UsersTournaments>>({
        queryKey: ['userTournaments', userId, page],
        queryFn: () => fetchPaginatedUserTournaments(userId, page, pageSize),
        placeholderData: (prev) => prev,
    });
}

const fetchPaginatedUserTournaments = async (userId: number, page: number, pageSize: number): Promise<PaginatedResult<UsersTournaments>> => {
    const response = await axiosInstance.get<PaginatedResult<UsersTournaments>>(`/tournaments/joined-tournaments-paginated`, {
        params: { userId, page, pageSize }
    });
    return response.data;
};


//leave tournament
const leaveTournament = async (leaveTournamentData: LeaveTournamentData) => {
    const res = await axiosInstance.delete('/tournaments/leave', {
        data: leaveTournamentData
    });
    return res.data;
}

export const useLeaveTournament = () => {
    return useMutation({
        mutationFn: leaveTournament,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },   
    })
}