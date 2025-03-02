export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    userId: number,
    firstName: string,
    lastName: string,
    role: string,
    token: string,
    message: string
}