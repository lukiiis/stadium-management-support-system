using backend.Enums;

namespace backend.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public int Phone { get; set; }
        public string Email {  get; set; }
        public string Password { get; set; }
        public Role Role { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool? Enabled { get; set; }
        
        //only client
        public double? Wallet {  get; set; }

        // only admin and employee
        public string? Position {  get; set; }
        public double? Salary { get; set; }

        //only user
        public int? AddressId { get; set; }
        public Address? Address { get; set; }

        public ICollection<UserTournament> UserTournaments { get; set; }
        public ICollection<Reservation> Reservations { get; set; }
    }
}
