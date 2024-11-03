namespace backend.Models
{
    public class Tournament
    {
        public int TournamentId { get; set; }
        public string Sport { get; set; }
        public int MaxSlots { get; set; }
        public int OccupiedSlots { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }

        public ICollection<UserTournament> UserTournaments { get; set; }
    }
}
