import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import axiosInstance from "../../../../config/axiosConfig"
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse"
import { CreateEmployeeData } from "../../../../shared/types/models/user"

export const useCreateEmployee = () => {
    return useMutation({
        mutationFn: createEmployeePost,
        onSuccess: (data: ApiSuccessResponse) => {
            console.log(data)
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            console.log(error)
        },   
    })
}

const createEmployeePost = async (employeeData: CreateEmployeeData) => {
    const res = await axiosInstance.post('/users/register-employee', employeeData);
    return res.data;
}