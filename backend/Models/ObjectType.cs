namespace backend.Models
{
    public class ObjectType
    {
        public int ObjectId { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }

        public ICollection<Reservation> Reservations { get; set; }
    }
}
