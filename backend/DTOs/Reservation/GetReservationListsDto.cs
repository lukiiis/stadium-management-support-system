namespace backend.DTOs.Reservation
{
    public class GetReservationListsDto
    {
        public TimeOnly ReservationsStart { get; set; }
        public TimeOnly ReservationsEnd { get; set; }
        public List<TimeOnly> FreeHours { get; set; }
        public List<TimeOnly> ReservedHours { get; set; }
        public DateOnly Date { get; set; }
        public bool IsTournament { get; set; }
    }
}
