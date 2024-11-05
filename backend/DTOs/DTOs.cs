namespace backend.DTOs
{
    public class AddressDto
    {
        public int AddressId { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string Zipcode { get; set; }
    }
    public class ObjectTypeDto
    {
        public int ObjectId { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class ReservationDto
    {
        public int ReservationId { get; set; }
        public TimeOnly ReservationStart { get; set; }
        public TimeOnly ReservationEnd { get; set; }
        public DateOnly ReservationDate { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime? ReservedAt { get; set; }
        public double Price { get; set; }

        public ObjectTypeDto ObjectType { get; set; }
        public UserDto User { get; set; }
    }

    public class ReservationTimesheetDto
    {
        public int TimesheetId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }

        public ObjectTypeDto ObjectType { get; set; }
    }

    public class TournamentDto
    {
        public int TournamentId { get; set; }
        public string Sport { get; set; }
        public int MaxSlots { get; set; }
        public int? OccupiedSlots { get; set; }
        public DateTime? StartDate { get; set; }
        public string Description { get; set; }
    }

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

    public class UserTournamentDto
    {
        public UserDto User { get; set; }
        public TournamentDto Tournament { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime? JoinedAt { get; set; }
    }
}