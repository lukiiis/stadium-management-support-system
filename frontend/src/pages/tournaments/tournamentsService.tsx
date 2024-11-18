import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export interface ObjectType {
    objectId: number,
    type: string,
    description: string,
    imageUrl: string,
}

export interface Tournament {
    tournamentId: number,
    sport: string,
    maxSlots: number,
    occupiedSlots: number,
    startDate: string,
    endDate: string,
    description: string,
    objectType: ObjectType,
}

// -------- firstly fetching object to be able to sort torunaments by objectId
const fetchAllObjectTypes = async (): Promise<ObjectType[]> => {
    const response = await axios.get<ObjectType[]>(`https://localhost:7234/api/object-types/get-all`);
    return response.data;
};

export const useGetObjectTypes = () => {
    return useQuery<ObjectType[]>({
        queryKey:['objectTypes'],
        queryFn: fetchAllObjectTypes,
    });
}


// --- now all tournaments for all objects
const fetchAllTournaments = async (): Promise<Tournament[]> => {
    const response = await axios.get<Tournament[]>(`https://localhost:7234/api/tournaments`);
    return response.data;
};

export const useGetTournaments = () => {
    return useQuery<Tournament[]>({
        queryKey:['tournaments'],
        queryFn: fetchAllTournaments,
    });
}


// ---- now tournaments by objectId
const fetchAllTournamentsByObjectId = async (objectId: number): Promise<Tournament[]> => {
    const response = await axios.get<Tournament[]>(`https://localhost:7234/api/tournaments/${objectId}`);
    return response.data;
};

export const useGetTournamentsByObjectId = (objectId: number) => {
    return useQuery<Tournament[]>({
        queryKey:['tournamentsByObjectId', objectId],
        queryFn: () => fetchAllTournamentsByObjectId(objectId),
    });
}


// fetching tournaments that client has joined to show JOIN or LEAVE buttons
export interface UsersTournaments {
    tournament: Tournament,
    paymentStatus: string,
    joinedAt: string,
}

const fetchUsersTournaments = async (userId: number): Promise<UsersTournaments[]> => {
    const response = await axios.get<UsersTournaments[]>(`https://localhost:7234/api/tournaments/joined-tournaments`, {
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
export interface JoinLeaveTournamentResponse {
    message: string;
}

export interface JoinLeaveTournamentErrorResponse {
    error: string
}

interface JoinTournamentData {
    userId: number,
    tournamentId: number,
    isPaid: boolean,
}

const joinTournament = async (joinTournamentData: JoinTournamentData) => {
    const res = await axios.post('https://localhost:7234/api/tournaments/join', joinTournamentData);
    return res.data;
}

export const useJoinTournament = () => {
    return useMutation({
        mutationFn: joinTournament,
        onSuccess: (data: JoinLeaveTournamentResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<JoinLeaveTournamentErrorResponse>) => {
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
    const res = await axios.delete('https://localhost:7234/api/tournaments/leave', {
        data: leaveTournamentData
    });
    return res.data;
}

export const useLeaveTournament = () => {
    return useMutation({
        mutationFn: leaveTournament,
        onSuccess: (data: JoinLeaveTournamentResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<JoinLeaveTournamentErrorResponse>) => {
            console.log(error)
        },   
    })
}