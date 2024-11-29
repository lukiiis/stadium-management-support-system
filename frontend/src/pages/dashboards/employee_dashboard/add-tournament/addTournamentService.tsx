import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import axiosInstance from "../../../../config/axiosConfig"
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse"
import { CreateTournamentData } from "../../../../shared/types/models/tournament"
import { ObjectTypeDto } from "../../../../shared/types/models/objectType"

export const useCreateTournament = () => {
    return useMutation({
        mutationFn: createTournamentPost,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },   
    })
}

const createTournamentPost = async (tournamentData: CreateTournamentData) => {
    const res = await axiosInstance.post('/tournaments/create', tournamentData);
    return res.data;
}

// fetching objects to get their id's
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