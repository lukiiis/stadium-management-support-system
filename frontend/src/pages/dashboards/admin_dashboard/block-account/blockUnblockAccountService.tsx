import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import axiosInstance from "../../../../config/axiosConfig"
import { PaginatedResult } from "../../../../shared/types/pagination/pagination"
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse"
import { UserDto } from "../../../../shared/types/models/user"

//block user
export const useBlockUser = () => {
    return useMutation({
        mutationFn: blockUser,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },
    })
}

const blockUser = async (userId: number) => {
    const res = await axiosInstance.put(`/users/${userId}/block`);
    return res.data;
}


//unblock user
export const useUnblockUser = () => {
    return useMutation({
        mutationFn: unblockUser,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },
    })
}

const unblockUser = async (userId: number) => {
    const res = await axiosInstance.put(`/users/${userId}/unblock`);
    return res.data;
}


// pagination get all users
export const useGetPaginatedUsers = (page: number, pageSize: number) => {
    return useQuery<PaginatedResult<UserDto>>({
        queryKey: ['users', page],
        queryFn: () => fetchPaginatedUsers(page, pageSize),
        placeholderData: (prev) => prev,
        staleTime: 100000,
    });
}


export const fetchPaginatedUsers = async (page: number, pageSize: number) => {
    const res = await axiosInstance.get('/users/paginated/get-all', {
        params: { page, pageSize },
    });
    return res.data;
};