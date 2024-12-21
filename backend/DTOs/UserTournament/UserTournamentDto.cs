using backend.DTOs.Tournament;

namespace backend.DTOs.UserTournament
{
    public class UserTournamentDto
    {
        public TournamentDto Tournament { get; set; }
        public DateTime JoinedAt { get; set; }
    }
}
