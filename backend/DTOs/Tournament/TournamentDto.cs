using backend.DTOs.ObjectType;

namespace backend.DTOs.Tournament
{
    public class TournamentDto
    {
        public int TournamentId { get; set; }
        public string Sport { get; set; }
        public int MaxSlots { get; set; }
        public int OccupiedSlots { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Description { get; set; }
        public ObjectTypeDto ObjectType { get; set; }
    }
}
