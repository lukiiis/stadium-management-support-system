using AutoMapper;
using backend.Data;
using backend.DTOs;
using backend.DTOs.Tournament;
using backend.Models;

namespace backend.Services
{
    public interface ITournamentsService
    {
        Task CreateTournament(TournamentCreateDto dto);
    }

    public class TournamentsService(ApplicationDbContext context, IMapper mapper) : ITournamentsService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task CreateTournament(TournamentCreateDto dto)
        {
            var tournament = _mapper.Map<Tournament>(dto);

            _context.Tournament.Add(tournament);
            await _context.SaveChangesAsync();
        }
    }
}
