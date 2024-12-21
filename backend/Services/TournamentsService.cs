using AutoMapper;
using backend.Data;
using backend.DTOs;
using backend.DTOs.Tournament;
using backend.DTOs.UserTournament;
using backend.Enums;
using backend.Models;
using backend.Services.Pagination;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface ITournamentsService
    {
        Task CreateTournament(CreateTournamentDto dto);
        Task JoinTournamentAsync(JoinTournamentDto dto);
        Task LeaveTournamentAsync(LeaveTournamentDto dto);
        Task<IEnumerable<UserTournamentDto>> GetUserTournamentsAsync(int userId);
        Task<PaginatedResult<UserTournamentDto>> GetUserTournamentsPaginatedAsync(int userId, int page, int pageSize);
        Task<PaginatedResult<TournamentDto>> GetAllTournamentsPaginatedAsync(int page, int pageSize);
        Task<Tournament?> GetTournamentByIdAsync(int tournamentId);
        Task<IEnumerable<TournamentDto>> GetAllTournaments();
        Task<IEnumerable<TournamentDto>> GetAllTournamentsByObjectId(int objectId);
        Task<bool> IsTournamentDateRangeAvailable(CreateTournamentDto tournamentDto);
        Task<IEnumerable<TournamentDto>> GetAllNotStartedTournaments();
    }

    public class TournamentsService(IUsersService usersService, IReservationTimesheetsService reservationTimesheetsService, IReservationsService reservationsService, ApplicationDbContext context, IMapper mapper) : ITournamentsService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IUsersService _usersService = usersService;
        private readonly IReservationTimesheetsService _reservationTimesheetsService = reservationTimesheetsService;
        private readonly IReservationsService _reservationsService = reservationsService;
        private readonly IMapper _mapper = mapper;

        public async Task CreateTournament(CreateTournamentDto dto)
        {
            if(dto.StartDate > dto.EndDate)
                throw new Exception("Start tournament date can't be later than end tournament date");
            //CHECK IF THERE IS ALREADY A TOURNAMENT FOR THOSE DAYS SO THEY WILL NOT INTERCEPT WITH EACH OTHER BY OBJECTID
            if (await IsTournamentDateRangeAvailable(dto) == false)
                throw new Exception("There is already an existing tournament for that date, choose other dates");


            //check if the timesheet exist for days specified for tournament (should not exist)
            var timesheets = await _reservationTimesheetsService.GetTimesheetsByDateRangeAndObjectId(dto.StartDate, dto.EndDate, dto.ObjectId);
            
            if(timesheets.Any()) //if yes, check if they are free (get reservations for each day)
            {
                List<Reservation> reservationList = [];

                foreach (var timesheet in timesheets)
                {
                    var reservations = await _reservationsService.GetReservationsByDateAndObject(timesheet.Date, timesheet.ObjectId);
                    foreach (var reservation in reservations)
                    {
                        reservationList.Add(reservation);
                    }
                }

                if (reservationList.Any())
                    throw new Exception("For those days there are already reservations, please specify another dates");
                else
                {
                    //delete those timesheets
                    foreach (var timesheet in timesheets)
                    {
                        _context.ReservationTimesheets.Remove(timesheet);
                    }

                    await _context.SaveChangesAsync();

                    //add timesheets FOR ALL TOURNAMENT DAYS
                    await _reservationTimesheetsService.CreateTimesheetsForTournaments(dto.StartDate, dto.EndDate, dto.ObjectId);
                }
            }
            else
            {
                //if no or does not contain reservations, then create those timesheets with IsTournament=true
                await _reservationTimesheetsService.CreateTimesheetsForTournaments(dto.StartDate, dto.EndDate, dto.ObjectId);
            }

            var tournament = _mapper.Map<Tournament>(dto);

            _context.Tournaments.Add(tournament);
            await _context.SaveChangesAsync();
        }

        public async Task JoinTournamentAsync(JoinTournamentDto dto)
        {
            var user = await _usersService.GetUserById(dto.UserId);
            var tournament = await GetTournamentByIdAsync(dto.TournamentId);

            if (user == null || tournament == null)
                throw new Exception("User or Tournament not found.");

            var existingEntry = await _context.UsersTournaments
                .AnyAsync(ut => ut.UserId == dto.UserId && ut.TournamentId == dto.TournamentId);

            if (existingEntry)
                throw new Exception("User has already joined this tournament.");

            if (tournament.StartDate <= DateOnly.FromDateTime(DateTime.Now))
                throw new Exception("Tournament has already started.");

            if (tournament.OccupiedSlots >= tournament.MaxSlots)
                throw new Exception("No slots available in this tournament.");

            var userTournament = new UserTournament
            {
                UserId = dto.UserId,
                TournamentId = dto.TournamentId,
                JoinedAt = DateTime.Now
            };

            _context.UsersTournaments.Add(userTournament);

            tournament.OccupiedSlots += 1;

            await _context.SaveChangesAsync();
        }
        public async Task LeaveTournamentAsync(LeaveTournamentDto dto)
        {
            var tournament = await GetTournamentByIdAsync(dto.TournamentId);
            if (tournament == null)
                throw new Exception("Tournament not found.");

            var userTournament = await _context.UsersTournaments
                .FirstOrDefaultAsync(ut => ut.UserId == dto.UserId && ut.TournamentId == dto.TournamentId);

            if (userTournament == null)
                throw new Exception("User is not enrolled in the tournament.");

            var today = DateOnly.FromDateTime(DateTime.Now);
            if (today >= tournament.StartDate)
                throw new Exception("Cannot leave the tournament after it has started.");

            _context.UsersTournaments.Remove(userTournament);

            tournament.OccupiedSlots--;
            _context.Tournaments.Update(tournament);

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<UserTournamentDto>> GetUserTournamentsAsync(int userId)
        {
            var userTournaments = await _context.UsersTournaments
                .Where(ut => ut.UserId == userId)
                .Include(ut => ut.Tournament)
                .ThenInclude(t => t.ObjectType)
                .OrderByDescending(ut => ut.JoinedAt)
                .ToListAsync();

            return _mapper.Map<IEnumerable<UserTournamentDto>>(userTournaments);
        }

        public async Task<PaginatedResult<UserTournamentDto>> GetUserTournamentsPaginatedAsync(int userId, int page, int pageSize)
        {
            var query = _context.UsersTournaments
                .Where(ut => ut.UserId == userId)
                .Include(ut => ut.Tournament)
                .ThenInclude(t => t.ObjectType)
                .OrderByDescending(ut => ut.JoinedAt);

            var totalCount = await query.CountAsync();

            var userTournaments = await query
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var mappedTournaments = _mapper.Map<IEnumerable<UserTournamentDto>>(userTournaments);

            return new PaginatedResult<UserTournamentDto>
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                Items = mappedTournaments.ToList()
            };
        }

        public async Task<PaginatedResult<TournamentDto>> GetAllTournamentsPaginatedAsync(int page, int pageSize)
        {
            var query = _context.Tournaments
                .Where(t => t.StartDate >= DateOnly.FromDateTime(DateTime.Now))
                .Include(t => t.ObjectType)
                .OrderByDescending(t => t.StartDate);

            var totalCount = await query.CountAsync();

            var tournaments = await query
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var mappedTournaments = _mapper.Map<IEnumerable<TournamentDto>>(tournaments);

            return new PaginatedResult<TournamentDto>
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                Items = mappedTournaments.ToList()
            };
        }

        public async Task<bool> IsTournamentDateRangeAvailable(CreateTournamentDto tournamentDto)
        {
            var conflictingTournament = await _context.Tournaments
                .Where(t => t.ObjectId == tournamentDto.ObjectId)
                .Where(t => t.StartDate <= tournamentDto.EndDate && t.EndDate >= tournamentDto.StartDate)
                .FirstOrDefaultAsync();

            return conflictingTournament == null;
        }

        public async Task<Tournament?> GetTournamentByIdAsync(int tournamentId)
        {
            return await _context.Tournaments
                .Where(t => t.TournamentId == tournamentId)
                .FirstOrDefaultAsync();
        }
        public async Task<IEnumerable<TournamentDto>> GetAllTournaments()
        {
            var tournaments = await _context.Tournaments
                .Where(t => t.StartDate >= DateOnly.FromDateTime(DateTime.Now))
                .Include(t => t.ObjectType)
                .OrderByDescending(t => t.StartDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TournamentDto>>(tournaments);
        }

        public async Task<IEnumerable<TournamentDto>> GetAllTournamentsByObjectId(int objectId)
        {
            var tournaments = await _context.Tournaments
                .Include(t => t.ObjectType)
                .Where(t => t.ObjectType.ObjectId == objectId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TournamentDto>>(tournaments);
        }

        public async Task<IEnumerable<TournamentDto>> GetAllNotStartedTournaments()
        {
            var tournaments = await _context.Tournaments
                .Where(t => t.StartDate >= DateOnly.FromDateTime(DateTime.Now))
                .Include(t => t.ObjectType)
                .OrderBy(t => t.StartDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TournamentDto>>(tournaments);
        }
    }
}
