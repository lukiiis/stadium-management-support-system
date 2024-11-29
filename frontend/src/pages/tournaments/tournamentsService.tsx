import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "../../config/axiosConfig";
import { ObjectTypeDto } from "../../shared/types/models/objectType";
import { TournamentDto } from "../../shared/types/models/tournament";
import { UsersTournaments } from "../../shared/types/models/userTournament";
import { ApiErrorResponse, ApiSuccessResponse } from "../../shared/types/api/apiResponse";

// -------- firstly fetching object to be able to sort torunaments by objectId
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


// --- now all tournaments for all objects
const fetchAllTournaments = async (): Promise<TournamentDto[]> => {
    const response = await axiosInstance.get<TournamentDto[]>(`/tournaments/not-started`);
    return response.data;
};

export const useGetTournaments = () => {
    return useQuery<TournamentDto[]>({
        queryKey:['tournaments'],
        queryFn: fetchAllTournaments,
    });
}


// ---- now tournaments by objectId
const fetchAllTournamentsByObjectId = async (objectId: number): Promise<TournamentDto[]> => {
    const response = await axiosInstance.get<TournamentDto[]>(`/tournaments/${objectId}`);
    return response.data;
};

export const useGetTournamentsByObjectId = (objectId: number) => {
    return useQuery<TournamentDto[]>({
        queryKey:['tournamentsByObjectId', objectId],
        queryFn: () => fetchAllTournamentsByObjectId(objectId),
    });
}


// fetching tournaments that client has joined to show JOIN or LEAVE buttons
const fetchUsersTournaments = async (userId: number): Promise<UsersTournaments[]> => {
    const response = await axiosInstance.get<UsersTournaments[]>(`/tournaments/joined-tournaments`, {
        params: {userId}
    });
    return response.data;
};

export const useGetUsersTournaments = (userId: number) => {
    return useQuery<UsersTournaments[]>({
        queryKey:['usersTournaments', userId],
        queryFn: () => fetchUsersTournaments(userId),
    });
}

// join tournament mutation
interface JoinTournamentData {
    userId: number,
    tournamentId: number,
    isPaid: boolean,
}

const joinTournament = async (joinTournamentData: JoinTournamentData) => {
    const res = await axiosInstance.post('/tournaments/join', joinTournamentData);
    return res.data;
}

export const useJoinTournament = () => {
    return useMutation({
        mutationFn: joinTournament,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },   
    })
}


// leave tournament mutation
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