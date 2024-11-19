import { useMutation, useQuery } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"

export interface CreateTournamentData {
    sport: string,
    maxSlots: number,
    startDate: string,
    endDate: string,
    description: string,
    objectId: number | null,
}

export interface CreateTournamentResponse {
    message: string,
}

export interface CreateTournamentErrorResponse {
    error: string,
}

export const useCreateTournament = () => {
    return useMutation({
        mutationFn: createTournamentPost,
        onSuccess: (data: CreateTournamentResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<CreateTournamentErrorResponse>) => {
            console.log(error)
        },   
    })
}

const createTournamentPost = async (tournamentData: CreateTournamentData) => {
    const res = await axios.post('https://localhost:7234/api/tournaments/create', tournamentData);
    return res.data;
}

// fetching objects to get their id's
export interface ObjectType {
    objectId: number;
    type: string;
    description: string;
    imageUrl: string;
}

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