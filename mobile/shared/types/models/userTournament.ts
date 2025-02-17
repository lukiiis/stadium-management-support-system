import { TournamentDto } from "./tournament";

export interface UsersTournaments {
    tournament: TournamentDto,
    joinedAt: string,
}

export interface JoinTournamentData {
    userId: number,
    tournamentId: number,
    isPaid: boolean,
}

export interface LeaveTournamentData {
    userId: number,
    tournamentId: number,
}