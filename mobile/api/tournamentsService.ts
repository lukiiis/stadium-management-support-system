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
    const response = await fetch(`https://localhost:7234/api/tournaments/all-tournaments-paginated?page=${page}&pageSize=${pageSize}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };