namespace backend.DTOs.Tournament
{
    public class CreateTournamentDto
    {
        public string Sport { get; set; }
        public int MaxSlots { get; set; }
        public DateTime StartDate { get; set; }
        public string Description { get; set; }
    }
}
