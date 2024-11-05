namespace backend.Models
{
    public class Reservation
    {
        public int ReservationId { get; set; }
        public TimeOnly ReservationStart { get; set; }
        public TimeOnly ReservationEnd { get; set; }
        public DateOnly ReservationDate { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public DateTime? ReservedAt { get; set; }
        public double Price { get; set; }

        public int ObjectId { get; set; }
        public ObjectType ObjectType { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
