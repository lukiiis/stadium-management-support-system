import { ObjectTypeDto } from "./objectType";

export interface ReservationDto {
    reservationId: number,
    reservationStart: string;
    reservationEnd: string;
    reservationDate: string;
    paymentStatus: string,
    reservedAt: string,
    price: number;
    objectType: ObjectTypeDto;
}

export interface CreateReservationData {
    reservationStart: string | null;
    reservationEnd: string | null;
    reservationDate: string;
    price: number | undefined;
    objectId: number | null;
    userId: number | null;
    isPaid: boolean;
}

export interface ReservationListsResponse {
    reservationsStart: string
    reservationsEnd: string
    freeHours: string[]
    reservedHours: string[]
    date: string
    isTournament: boolean
};