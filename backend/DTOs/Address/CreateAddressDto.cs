﻿namespace backend.DTOs.Address
{
    public class CreateAddressDto
    {
        public int UserId { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string Zipcode { get; set; }
    }
}
