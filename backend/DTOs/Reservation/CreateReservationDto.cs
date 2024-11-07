using backend.DTOs.ObjectType;
using backend.DTOs.User;

namespace backend.DTOs.Reservation
{
    public class CreateReservationDto
    {
        public TimeOnly ReservationStart { get; set; }
        public TimeOnly ReservationEnd { get; set; }
        public DateOnly ReservationDate { get; set; }
        public double Price { get; set; }
        public int ObjectId { get; set; }
        public int UserId { get; set; }
        public bool IsPaid { get; set; }
    }
}
