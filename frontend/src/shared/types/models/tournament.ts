import { ObjectTypeDto } from "./objectType";

export interface TournamentDto {
    tournamentId: number,
    sport: string,
    maxSlots: number,
    occupiedSlots: number,
    startDate: string,
    endDate: string,
    description: string,
    objectType: ObjectTypeDto,
}

export interface CreateTournamentData {
    sport: string,
    maxSlots: number,
    startDate: string,
    endDate: string,
    description: string,
    objectId: number | null,
}