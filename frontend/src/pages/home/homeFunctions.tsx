import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosConfig";
import { ObjectTypeDto } from "../../shared/types/models/objectType";

const fetchAllObjectTypes = async (): Promise<ObjectTypeDto[]> => {
    const response = await axiosInstance.get<ObjectTypeDto[]>(`/object-types/get-all`);
    return response.data;
};

export const useGetObjectTypes = () => {
    return useQuery<ObjectTypeDto[]>({
        queryKey: ['objectTypes'],
        queryFn: fetchAllObjectTypes,
    });
};