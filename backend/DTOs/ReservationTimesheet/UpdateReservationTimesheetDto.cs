namespace backend.DTOs.ReservationTimesheet
{
    public class UpdateReservationTimesheetDto
    {
        public int TimesheetId { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }
}
