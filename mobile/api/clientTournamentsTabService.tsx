import axiosInstance from "@/config/axiosConfig";
import { ApiSuccessResponse, ApiErrorResponse } from "@/shared/types/api/apiResponse";
import { UsersTournaments, LeaveTournamentData } from "@/shared/types/models/userTournament";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

// get joined tournaments paginated
export const useGetPaginatedUserTournaments = (userId: number) => {
    return useQuery<UsersTournaments[]>({
        queryKey: ['userTournaments', userId],
        queryFn: () => fetchPaginatedUserTournaments(userId),
        placeholderData: (prev) => prev,
    });
}

const fetchPaginatedUserTournaments = async (userId: number): Promise<UsersTournaments[]> => {
    const response = await axiosInstance.get<UsersTournaments[]>(`/tournaments/joined-tournaments`, {
        params: { userId }
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