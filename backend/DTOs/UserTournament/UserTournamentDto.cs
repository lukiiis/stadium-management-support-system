using backend.DTOs.Tournament;
using backend.DTOs.User;

namespace backend.DTOs.UserTournament
{
    public class UserTournamentDto
    {
        public UserDto User { get; set; }
        public TournamentDto Tournament { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime JoinedAt { get; set; }
    }
}
