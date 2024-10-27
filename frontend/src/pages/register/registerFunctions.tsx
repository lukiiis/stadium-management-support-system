import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { UseFormReturn, UseFormSetError } from "react-hook-form";

export interface RegisterStatus{
    status: string,
    message: string | undefined
}

interface RegisterErrorResponse {
    error: string
}

interface RegisterResponse {
    message: string
}

export interface RegisterData {
    email: string,
    password: string,
    rePassword: string,
    firstName: string,
    lastName: string,
    age: number,
    phone: string,
    role: string,
}

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
        onError: (error: AxiosError<RegisterErrorResponse>) => {
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
    const res = await axios.post(`https://localhost:7234/api/users/is-valid/${email}`);
    return res.data;
}


// --------register---------

//custom hook
export const useRegisterUser = (setRegInfo: React.Dispatch<React.SetStateAction<RegisterStatus>>, registerForm: UseFormReturn<RegisterData>) => {
    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data: RegisterResponse) => {
            console.log(data)
            setRegInfo({
                message:data.message,
                status:"Success"
            });
            registerForm.reset();
        },
        onError: (error: AxiosError<RegisterErrorResponse>) => {
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
    const res = await axios.post('https://localhost:7234/api/users/register', userData);
    return res.data;
}