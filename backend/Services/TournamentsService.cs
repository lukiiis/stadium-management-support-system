using AutoMapper;
using backend.Data;
using backend.DTOs;
using backend.DTOs.Tournament;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface ITournamentsService
    {
        Task CreateTournament(CreateTournamentDto dto);
        Task<IEnumerable<TournamentDto>> GetAllTournaments();
    }

    public class TournamentsService(ApplicationDbContext context, IMapper mapper) : ITournamentsService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task CreateTournament(CreateTournamentDto dto)
        {
            var tournament = _mapper.Map<Tournament>(dto);

            _context.Tournaments.Add(tournament);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<TournamentDto>> GetAllTournaments()
        {
            var tournaments = await _context.Tournaments
                .ToListAsync();

            return _mapper.Map<IEnumerable<TournamentDto>>(tournaments);
        }
    }
}
