import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import axiosInstance from "../../../../config/axiosConfig"

export interface CreateEmployeeData {
    firstName: string,
    lastName: string,
    age: number,
    phone: number,
    email: string,
    salary: number,
    position: string,
}

export interface CreateEmployeeResponse {
    message: string,
}

export interface CreateEmployeeErrorResponse {
    error: string,
}

export const useCreateEmployee = () => {
    return useMutation({
        mutationFn: createEmployeePost,
        onSuccess: (data: CreateEmployeeResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<CreateEmployeeErrorResponse>) => {
            console.log(error)
        },   
    })
}

const createEmployeePost = async (employeeData: CreateEmployeeData) => {
    const res = await axiosInstance.post('/users/register-employee', employeeData);
    return res.data;
}