import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UseFormReturn } from "react-hook-form";
import axiosInstance from "../../config/axiosConfig";
import { ApiErrorResponse } from "../../shared/types/api/apiResponse";
import { LoginData, LoginResponse, LoginStatus } from "../../shared/types/auth/login";

//custom hook
export const useLoginUser = (setLoginInfo: React.Dispatch<React.SetStateAction<LoginStatus>>, loginForm: UseFormReturn<LoginData, unknown, undefined>) => {
    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data: LoginResponse) => {
            setLoginInfo({
                status: "Success",
                message: data.message
            });
            localStorage.setItem("userId", data.userId.toString())
            localStorage.setItem("token", data.token);
            localStorage.setItem("firstName", data.firstName);
            localStorage.setItem("lastName", data.lastName);
            localStorage.setItem("role", data.role);
            console.log(data);
            loginForm.reset()
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error);
            //error login
            setLoginInfo({
                status: "Error",
                message: error.response?.data.error
            });
        },
    })
}

export const loginUser = async (loginData: LoginData) => {
    const res = await axiosInstance.post('/users/login', loginData);
    return res.data;
}