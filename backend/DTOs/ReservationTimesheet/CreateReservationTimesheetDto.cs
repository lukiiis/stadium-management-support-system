using backend.DTOs.ObjectType;

namespace backend.DTOs.ReservationTimesheet
{
    public class CreateReservationTimesheetDto
    {
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public int ObjectId { get; set; }
    }
}
