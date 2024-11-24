import { useMutation, useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import axiosInstance from "../../../../config/axiosConfig"
import { PaginatedResult } from "../../../../shared/pagination"

export interface BlockUnblockResponse {
    message: string,
}

export interface BlockUnblockErrorResponse {
    error: string,
}

//block user
export const useBlockUser = () => {
    return useMutation({
        mutationFn: blockUser,
        onSuccess: (data: BlockUnblockResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<BlockUnblockErrorResponse>) => {
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
        onSuccess: (data: BlockUnblockResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<BlockUnblockErrorResponse>) => {
            console.log(error)
        },
    })
}

const unblockUser = async (userId: number) => {
    const res = await axiosInstance.put(`/users/${userId}/unblock`);
    return res.data;
}


// pagination get all users
export interface UserData {
    userId: number,
    firstName: string,
    lastName: string,
    age: number,
    phone: number,
    email: string,
    role: string,
    createdAt: string | null,
    wallet: number | null,
    position: string | null,
    salary: number | null,
    enabled: boolean | null,
    address: {
        addressId: number,
        country: string,
        city: string,
        street: string,
        zipcode: string,
    } | null,
}

export const useGetPaginatedUsers = (page: number, pageSize: number) => {
    return useQuery<PaginatedResult<UserData>>({
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