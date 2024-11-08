namespace backend.Models
{
    public class ReservationTimesheet
    {
        public int TimesheetId { get; set; }
        public DateOnly Date {  get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public bool? IsTournament { get; set; }

        public int ObjectId { get; set; }
        public ObjectType ObjectType { get; set; }
    }
}
