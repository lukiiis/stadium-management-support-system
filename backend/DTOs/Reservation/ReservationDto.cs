using backend.DTOs.ObjectType;
using backend.DTOs.User;

namespace backend.DTOs.Reservation
{
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
}
