export interface RegisterStatus{
    status: string,
    message: string | undefined
}

export interface RegisterErrorResponse {
    error: string
}

export interface RegisterResponse {
    message: string
}

export interface RegisterData {
    email: string,
    password: string,
    rePassword: string,
    firstName: string,
    lastName: string,
    age: number,
    phone: string,
    role: string,
}