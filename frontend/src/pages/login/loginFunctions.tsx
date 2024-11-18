import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { UseFormReturn } from "react-hook-form";

export interface LoginStatus{
    status: string,
    message: string | undefined
}

export interface LoginData {
    email: string;
    password: string;
}

interface LoginErrorResponse {
    error: string
}

interface LoginResponse {
    userId: number,
    firstName: string,
    lastName: string,
    role: string,
    token: string,
    message: string
}


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
        onError: (error: AxiosError<LoginErrorResponse>) => {
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
    const res = await axios.post('https://localhost:7234/api/users/login', loginData);
    return res.data;
}