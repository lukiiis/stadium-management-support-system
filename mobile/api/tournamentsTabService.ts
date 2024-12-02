// FILE: api/tournaments.ts

import axiosInstance from "@/config/axiosConfig";
import { TournamentDto } from "@/shared/types/models/tournament";
import { PaginatedResult } from "@/shared/types/pagination/pagination";
import { useQuery } from "@tanstack/react-query";

const fetchTournaments = async (page: number, pageSize: number): Promise<PaginatedResult<TournamentDto>> => {
  try {
    const response = await axiosInstance(`/tournaments/all-tournaments-paginated?page=${page}&pageSize=${pageSize}`);
    return response.data;
  }
  catch (error: any) {
    return error;
  }
}

export const useGetTournaments = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['tournaments', page, pageSize],
    queryFn: () => fetchTournaments(page, pageSize)
  },);
}