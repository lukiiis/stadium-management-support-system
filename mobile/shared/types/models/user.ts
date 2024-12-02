import { AddressDto } from "./address";

export interface UserDto {
    userId: number,
    firstName: string,
    lastName: string,
    age: number,
    phone: number,
    email: string,
    role: string,
    createdAt: string | null,
    wallet: number | null,
    position: string | null,
    salary: number | null,
    enabled: boolean | null,
    address: AddressDto | null,
}

export interface CreateEmployeeData {
    firstName: string,
    lastName: string,
    age: number,
    phone: number,
    email: string,
    salary: number,
    position: string,
}

export interface ChangePasswordData {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
}

export interface EditUserData {
    userId: number,
    firstName: string,
    lastName: string,
    age: number,
    phone: number,
    email: string,
}