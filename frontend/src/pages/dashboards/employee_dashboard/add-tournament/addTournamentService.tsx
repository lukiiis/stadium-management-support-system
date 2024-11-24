import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import axiosInstance from "../../../../config/axiosConfig"

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
    const res = await axiosInstance.post('/tournaments/create', tournamentData);
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
    const response = await axiosInstance.get<ObjectType[]>(`/object-types/get-all`);
    return response.data;
};

export const useGetObjectTypes = () => {
    return useQuery<ObjectType[]>({
        queryKey:['objectTypes'],
        queryFn: fetchAllObjectTypes,
    });
}