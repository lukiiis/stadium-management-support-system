import { ObjectTypeDto } from "./objectType";

export interface CreateReservationTimesheetData {
    date: string,
    startTime: string,
    endTime: string,
    objectId: number | null,
}

export interface ReservationTimesheetDto {
    timesheetId: number,
    date: string,
    startTime: string,
    endTime: string,
    isTournament: boolean,
    objectType: ObjectTypeDto,
}