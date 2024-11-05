namespace backend.DTOs.Tournament
{
    public class TournamentDto
    {
        public int TournamentId { get; set; }
        public string Sport { get; set; }
        public int MaxSlots { get; set; }
        public int OccupiedSlots { get; set; }
        public DateTime StartDate { get; set; }
        public string Description { get; set; }
    }
}
