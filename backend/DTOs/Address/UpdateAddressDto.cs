namespace backend.DTOs.Address
{
    public class UpdateAddressDto
    {
        public int AddressId { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string Zipcode { get; set; }
    }
}
