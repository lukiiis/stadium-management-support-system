import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../config/axiosConfig";
import { UserDto } from "../../../shared/types/models/user";

const fetchUserById = async (userId: number): Promise<UserDto> => {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get<UserDto>(`/users/id/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const useGetUserById = (userId: number) => {
    return useQuery<UserDto>({
        queryKey:['user'],
        queryFn: () => fetchUserById(userId),
        refetchInterval: 10000,
    });
}