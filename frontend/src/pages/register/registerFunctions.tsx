import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UseFormReturn, UseFormSetError } from "react-hook-form";
import axiosInstance from "../../config/axiosConfig";
import { ApiErrorResponse, ApiSuccessResponse } from "../../shared/types/api/apiResponse";
import { RegisterData, RegisterStatus } from "../../shared/types/auth/register";
// --------email validation---------

// custom hook
export const useValidateEmail = (setEmailValid: React.Dispatch<React.SetStateAction<boolean>>, setRegInfo: React.Dispatch<React.SetStateAction<RegisterStatus>>, setError: UseFormSetError<{email: string;}>) => {
    return useMutation({
        mutationFn: validateEmail,
        onSuccess: (data: boolean) => {
            //data retrieved
            if(data === true){
                setEmailValid(true);
            } 
            else{
                setEmailValid(false);
                setError('email', {
                    type: 'manual',
                    message: 'Provided email is taken.'
                })
            }
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            //error login
            setRegInfo({
                message: error.response?.data.error,
                status:"Error"
            });
        },     
    })
}

//email validation
export const validateEmail = async (email: string) => {
    const res = await axiosInstance.post(`/users/is-valid/${email}`);
    return res.data;
}


// --------register---------

//custom hook
export const useRegisterUser = (setRegInfo: React.Dispatch<React.SetStateAction<RegisterStatus>>, registerForm: UseFormReturn<RegisterData>) => {
    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
            setRegInfo({
                message:data.message,
                status:"Success"
            });
            registerForm.reset();
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            //error login
            console.log(error)
            setRegInfo({
                message: error.response?.data.error,
                status:"Error"
            });
        },   
    })
}

//registration
export const registerUser = async (userData: RegisterData) => {
    const res = await axiosInstance.post('/users/register', userData);
    return res.data;
}