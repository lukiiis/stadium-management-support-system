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
        Task<bool> IsTournamentDateRangeAvailable(CreateTournamentDto tournamentDto);
    }

    public class TournamentsService(IReservationTimesheetsService reservationTimesheetsService, IReservationsService reservationsService, ApplicationDbContext context, IMapper mapper) : ITournamentsService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IReservationTimesheetsService _reservationTimesheetsService = reservationTimesheetsService;
        private readonly IReservationsService _reservationsService = reservationsService;
        private readonly IMapper _mapper = mapper;

        public async Task CreateTournament(CreateTournamentDto dto)
        {
            //CHECK IF THERE IS ALREADY A TOURNAMENT FOR THOSE DAYS SO THEY WILL NOT INTERCEPT WITH EACH OTHER BY OBJECTID
            if(await IsTournamentDateRangeAvailable(dto) == false)
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
                    await _reservationTimesheetsService.CreateTimesheetsForDateRangeAndObjectIdAndFlag(dto.StartDate, dto.EndDate, dto.ObjectId);
                }
            }
            else
            {
                //if no or does not contain reservations, then create those timesheets with IsTournament=true
                await _reservationTimesheetsService.CreateTimesheetsForDateRangeAndObjectIdAndFlag(dto.StartDate, dto.EndDate, dto.ObjectId);
            }

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

        public async Task<bool> IsTournamentDateRangeAvailable(CreateTournamentDto tournamentDto)
        {
            var conflictingTournament = await _context.Tournaments
                .Where(t => t.ObjectId == tournamentDto.ObjectId)
                .Where(t => t.StartDate <= tournamentDto.EndDate && t.EndDate >= tournamentDto.StartDate)
                .FirstOrDefaultAsync();

            return conflictingTournament == null;
        }
    }
}
