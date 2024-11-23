import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../../config/axiosConfig";
import { AxiosError } from "axios";

export interface UserDataResponse {
    message: string,
}

export interface UserDataErrorResponse {
    error: string,
}

// get user data
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

export const useGetUserData = (userId: number) => {
    return useQuery<UserData>({
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
export interface EditUserData {
    userId: number,
    firstName: string,
    lastName: string,
    age: number,
    phone: number,
    email: string,
}

export const useUpdateData = () => {
    return useMutation({
        mutationFn: updateData,
        onSuccess: (data: UserDataResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<UserDataErrorResponse>) => {
            console.log(error)
        },
    })
}

const updateData = async (data: EditUserData) => {
    const res = await axiosInstance.put(`/users/update-personal-data`, data);
    return res.data;
}


// change password
export interface ChangePasswordData {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
}

export const useChangePassword = () => {
    return useMutation({
        mutationFn: changePassword,
        onSuccess: (data: UserDataResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<UserDataErrorResponse>) => {
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
export interface AddressData {
    addressId: number,
    country: string,
    city: string,
    street: string,
    zipcode: string,
}

export const useGetAddressData = (userId: number) => {
    return useQuery<AddressData>({
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
export interface CreateAddressData {
    userId: number,
    country: string,
    city: string,
    street: string,
    zipcode: string,  
}

export const useCreateAddress = () => {
    return useMutation({
        mutationFn: createAddressPost,
        onSuccess: (data: UserDataResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<UserDataErrorResponse>) => {
            console.log(error)
        },
    })
}

const createAddressPost = async (data: CreateAddressData) => {
    const res = await axiosInstance.post(`/addresses/create`, data);
    return res.data;
}


//update address
export interface UpdateAddressData {
    addressId: number,
    country: string,
    city: string,
    street: string,
    zipcode: string,  
}

export const useUpdateAddress = () => {
    return useMutation({
        mutationFn: updateAddressPost,
        onSuccess: (data: UserDataResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<UserDataErrorResponse>) => {
            console.log(error)
        },
    })
}

const updateAddressPost = async (data: UpdateAddressData) => {
    const res = await axiosInstance.post(`/addresses/update`, data);
    return res.data;
}