import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UseFormReturn } from "react-hook-form";
import axiosInstance from "@/config/axiosConfig";
import { LoginData, LoginResponse } from "@/shared/types/auth/login";
import { ApiErrorResponse } from "@/shared/types/api/apiResponse";
import AsyncStorage from '@react-native-async-storage/async-storage';

//custom hook
export const useLoginUser = (loginForm: UseFormReturn<LoginData, unknown, undefined>) => {
    return useMutation({
        mutationFn: loginUser,
        onSuccess: async (data: LoginResponse) => {
            await AsyncStorage.setItem("userId", data.userId.toString())
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("firstName", data.firstName);
            await AsyncStorage.setItem("lastName", data.lastName);
            await AsyncStorage.setItem("role", data.role);
            console.log(data);
            loginForm.reset()
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error);
        },
    })
}

export const loginUser = async (loginData: LoginData) => {
    const res = await axiosInstance.post('/users/login', loginData);
    return res.data;
}