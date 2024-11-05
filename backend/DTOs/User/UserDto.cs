using backend.DTOs.Address;

namespace backend.DTOs.User
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public int Phone { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime? CreatedAt { get; set; }
        public double? Wallet { get; set; }
        public string? Position { get; set; }
        public double? Salary { get; set; }

        public AddressDto? Address { get; set; }
    }
}
