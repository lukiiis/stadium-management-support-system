import axiosInstance from "@/config/axiosConfig";
import { ApiErrorResponse, ApiSuccessResponse } from "@/shared/types/api/apiResponse";
import { ChangePasswordData, EditUserData, UserDto } from "@/shared/types/models/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

// get user data
export const useGetUserData = (userId: number) => {
    return useQuery<UserDto>({
        queryKey: ['userData'],
        queryFn: () => fetchUserData(userId),
        enabled: !!userId,
    });
}

export const fetchUserData = async (userId: number) => {
    const res = await axiosInstance.get(`/users/id/${userId}`);
    return res.data;
};

// change user data
export const useUpdateData = () => {
    return useMutation({
        mutationFn: updateData,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },
    })
}

const updateData = async (data: EditUserData) => {
    const res = await axiosInstance.put(`/users/update-personal-data`, data);
    return res.data;
}


// change password
export const useChangePassword = () => {
    return useMutation({
        mutationFn: changePassword,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },
    })
}

const changePassword = async (data: { userId: number; passwordData: ChangePasswordData }) => {
    const res = await axiosInstance.patch(`/users/${data.userId}/password`, data.passwordData);
    return res.data;
};