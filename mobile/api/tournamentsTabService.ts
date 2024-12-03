// FILE: api/tournaments.ts

import axiosInstance from "@/config/axiosConfig";
import { ApiSuccessResponse, ApiErrorResponse } from "@/shared/types/api/apiResponse";
import { TournamentDto } from "@/shared/types/models/tournament";
import { JoinTournamentData, LeaveTournamentData, UsersTournaments } from "@/shared/types/models/userTournament";
import { PaginatedResult } from "@/shared/types/pagination/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

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

// fetching tournaments that client has joined to show JOIN or LEAVE buttons
const fetchUsersTournaments = async (userId: number): Promise<UsersTournaments[]> => {
  const response = await axiosInstance.get<UsersTournaments[]>(`/tournaments/joined-tournaments`, {
      params: {userId}
  });
  return response.data;
};

export const useGetUsersTournaments = (userId: number) => {
  return useQuery<UsersTournaments[]>({
      queryKey:['usersTournaments', userId],
      queryFn: () => fetchUsersTournaments(userId),
  });
}

// join tournament mutation
const joinTournament = async (joinTournamentData: JoinTournamentData) => {
  const res = await axiosInstance.post('/tournaments/join', joinTournamentData);
  return res.data;
}

export const useJoinTournament = () => {
  return useMutation({
      mutationFn: joinTournament,
      onSuccess: (data: ApiSuccessResponse) => {
          console.log(data)
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
          console.log(error)
      },   
  })
}


// leave tournament mutation
const leaveTournament = async (leaveTournamentData: LeaveTournamentData) => {
  const res = await axiosInstance.delete('/tournaments/leave', {
      data: leaveTournamentData
  });
  return res.data;
}

export const useLeaveTournament = () => {
  return useMutation({
      mutationFn: leaveTournament,
      onSuccess: (data: ApiSuccessResponse) => {
          console.log(data)
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
          console.log(error)
      },   
  })
}