namespace backend.DTOs.Tournament
{
    public class CreateTournamentDto
    {
        public string Sport { get; set; }
        public int MaxSlots { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Description { get; set; }
        public int ObjectId { get; set; }
    }
}
