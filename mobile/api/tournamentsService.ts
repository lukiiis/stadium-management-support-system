// FILE: api/tournaments.ts

export interface TournamentDto {
  tournamentId: number;
  sport: string;
  maxSlots: number;
  occupiedSlots: number;
  startDate: string;
  endDate: string;
  description: string;
  objectType: ObjectTypeDto;
}

export interface ObjectTypeDto {
  objectId: number;
  type: string;
  description: string;
  imageUrl: string;
}

export interface PaginatedResult<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  items: T[];
}

export const fetchTournaments = async (page: number, pageSize: number): Promise<PaginatedResult<TournamentDto>> => {
  try {
    const response = await fetch(`http://192.168.0.248:7234/api/tournaments/all-tournaments-paginated?page=0&pageSize=10`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
  catch (error: any) {
    return error;
  }
}