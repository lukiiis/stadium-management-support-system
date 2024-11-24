import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axiosConfig";
import { ApiErrorResponse, ApiSuccessResponse, ObjectTypeDto } from "../../../../shared/interfaces";
import { PaginatedResult } from "../../../../shared/pagination";
import { AxiosError } from "axios";

// get joined tournaments paginated
export interface Tournament {
    tournamentId: number,
    sport: string,
    maxSlots: number,
    occupiedSlots: number,
    startDate: string,
    endDate: string,
    description: string,
    objectType: ObjectTypeDto,
}

export interface UsersTournaments {
    tournament: Tournament,
    paymentStatus: string,
    joinedAt: string,
}

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
interface LeaveTournamentData {
    userId: number,
    tournamentId: number,
}

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