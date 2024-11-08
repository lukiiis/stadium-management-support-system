using backend.DTOs.ObjectType;

namespace backend.DTOs.ReservationTimesheet
{
    public class ReservationTimesheetDto
    {
        public int TimesheetId { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public bool IsTournament { get; set; }

        public ObjectTypeDto ObjectType { get; set; }
    }
}
