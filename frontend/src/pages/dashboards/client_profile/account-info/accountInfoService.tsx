import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axiosConfig";
import { AxiosError } from "axios";
import { createContext } from "react";
import { ApiSuccessResponse, ApiErrorResponse } from "../../../../shared/types/api/apiResponse";
import { AddressDto, CreateAddressData, UpdateAddressData } from "../../../../shared/types/models/address";
import { ChangePasswordData, EditUserData, UserDto } from "../../../../shared/types/models/user";

//context for snackbar adn token
interface AccountInfoContextType {
    userId: number,
    setSnackbarSeverity: React.Dispatch<React.SetStateAction<string>>,
    setSnackbarMessage: React.Dispatch<React.SetStateAction<string | null>>,
    setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>,
}

export const AccountInfoContext = createContext<AccountInfoContextType | undefined>(undefined);

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

// ---------------add/change address------------------

// get address by userId
export const useGetAddressData = (userId: number) => {
    return useQuery<AddressDto>({
        queryKey: ['addressData'],
        queryFn: () => fetchAddressData(userId),
        enabled: !!userId,
    });
}

export const fetchAddressData = async (userId: number) => {
    const res = await axiosInstance.get(`/addresses/by-user/${userId}`);
    return res.data;
};


// create address
export const useCreateAddress = () => {
    return useMutation({
        mutationFn: createAddressPost,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },
    })
}

const createAddressPost = async (data: CreateAddressData) => {
    const res = await axiosInstance.post(`/addresses/create`, data);
    return res.data;
}


//update address
export const useUpdateAddress = () => {
    return useMutation({
        mutationFn: updateAddressPost,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },
    })
}

const updateAddressPost = async (data: UpdateAddressData) => {
    const res = await axiosInstance.put(`/addresses/update`, data);
    return res.data;
}