namespace backend.DTOs.Tournament
{
    public class JoinTournamentDto
    {
        public int UserId { get; set; }
        public int TournamentId { get; set; }
        public bool IsPaid { get; set; }
    }
}
