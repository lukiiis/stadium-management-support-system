export interface ObjectTypeDto {
    objectId: number;
    type: string;
    description: string;
    imageUrl: string;
}

export interface ApiSuccessResponse {
    message: string,
}

export interface ApiErrorResponse {
    error: string,
}