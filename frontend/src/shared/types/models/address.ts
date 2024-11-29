export interface AddressDto {
    addressId: number,
    country: string,
    city: string,
    street: string,
    zipcode: string,
}

export interface CreateAddressData {
    userId: number,
    country: string,
    city: string,
    street: string,
    zipcode: string,  
}

export interface UpdateAddressData {
    addressId: number | undefined,
    country: string,
    city: string,
    street: string,
    zipcode: string,  
}