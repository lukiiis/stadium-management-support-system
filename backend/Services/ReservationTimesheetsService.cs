using AutoMapper;
using backend.Data;
using backend.DTOs.ReservationTimesheet;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IReservationTimesheetsService
    {
        Task<List<ReservationTimesheet>> GetTimesheetsByDateRangeAndObjectId(DateOnly startDate, DateOnly endDate, int objectId);
        Task<ReservationTimesheet?> GetTimesheetByDateAndObjectId(DateOnly date, int objectId);
        Task CreateTimesheetsForDateRangeAndObjectIdAndFlag(DateOnly startDate, DateOnly endDate, int objectId);
        Task CreateReservationTimesheet(CreateReservationTimesheetDto dto);
        Task UpdateReservationTimesheet(UpdateReservationTimesheetDto dto);
    }

    public class ReservationTimesheetsService(ApplicationDbContext context, IMapper mapper) : IReservationTimesheetsService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task<List<ReservationTimesheet>> GetTimesheetsByDateRangeAndObjectId(DateOnly startDate, DateOnly endDate, int objectId)
        {
            return await _context.ReservationTimesheets
                .Where(rt => rt.Date >= startDate && rt.Date <= endDate)
                .Where(rt => rt.ObjectId == objectId)
                .ToListAsync();
        }

        public async Task<ReservationTimesheet?> GetTimesheetByDateAndObjectId(DateOnly date, int objectId)
        {
            return await _context.ReservationTimesheets
                .Where(rt => rt.Date == date)
                .Where(rt => rt.ObjectId == objectId)
                .FirstOrDefaultAsync();
        }

        public async Task CreateTimesheetsForDateRangeAndObjectIdAndFlag(DateOnly startDate, DateOnly endDate, int objectId)
        {
            var timesheets = new List<ReservationTimesheet>();

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var timesheet = new ReservationTimesheet
                {
                    Date = date,
                    StartTime = new TimeOnly(0, 0, 0),
                    EndTime = new TimeOnly(0, 0, 0),
                    ObjectId = objectId,
                    IsTournament = true
                };
                timesheets.Add(timesheet);
            }

            await _context.ReservationTimesheets.AddRangeAsync(timesheets);
            await _context.SaveChangesAsync();
        }

        public async Task CreateReservationTimesheet(CreateReservationTimesheetDto dto)
        {
            var timesheet = await GetTimesheetByDateAndObjectId(dto.Date, dto.ObjectId);
            if (timesheet != null)
                throw new Exception("There is already a timesheet for this day");

            var timesheetToAdd = _mapper.Map<ReservationTimesheet>(dto);
            timesheetToAdd.IsTournament = false;

            await _context.ReservationTimesheets.AddAsync(timesheetToAdd);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateReservationTimesheet(UpdateReservationTimesheetDto dto)
        {
            var timesheet = await _context.ReservationTimesheets.FindAsync(dto.TimesheetId);
            if (timesheet == null)
                throw new Exception("Timesheet not found");

            timesheet.Date = dto.Date;
            timesheet.StartTime = dto.StartTime;
            timesheet.EndTime = dto.EndTime;

            _context.ReservationTimesheets.Update(timesheet);
            await _context.SaveChangesAsync();
        }
    }
}
