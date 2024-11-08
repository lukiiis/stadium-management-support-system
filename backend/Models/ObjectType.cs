namespace backend.Models
{
    public class ObjectType
    {
        public int ObjectId { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string? ImageUrl { get; set; }

        public ICollection<Reservation> Reservations { get; set; }
        public ICollection<Tournament> Tournaments { get; set; }
        public ICollection<ReservationTimesheet> ReservationTimesheets { get; set; } 
    }
}
