using AutoMapper;
using backend.Data;
using backend.DTOs.Reservation;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public sealed record FreeReservedHoursDto(List<TimeOnly> FreeHours, List<TimeOnly> ReservedHours);

    public interface IReservationsService
    {
        Task<string> CreateReservation(CreateReservationDto dto);
        Task<ReservationDto?> GetReservationsByIdAsync(int reservationId);
        Task<IEnumerable<ReservationDto>?> GetReservationsByUserIdAsync(int userId);
        Task<IEnumerable<Reservation>> GetReservationsByDateAndObject(DateOnly date, int objectId);
        Task<FreeReservedHoursDto> GetFreeAndReservedHoursByDayAndObjectId(DateOnly date, int ObjectId);
    }

    public class ReservationsService(IReservationTimesheetsService reservationTimesheetsService, ApplicationDbContext context, IMapper mapper) : IReservationsService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IReservationTimesheetsService _reservationTimesheetsService = reservationTimesheetsService;
        private readonly IMapper _mapper = mapper;

        public async Task<FreeReservedHoursDto> GetFreeAndReservedHoursByDayAndObjectId(DateOnly date, int objectId)
        {
            var timesheet = await _reservationTimesheetsService.GetTimesheetByDateAndObjectId(date, objectId);
            if (timesheet == null)
                throw new Exception("There is no timesheet for that date, specify another date");

            List<TimeOnly> reservedHours = [];
            List<TimeOnly> freeHours = [];

            var reservations = await GetReservationsByDateAndObject(date, objectId);
            if (reservations == null) //every hour is free
            {
                for(var hour = timesheet.StartTime; hour <= timesheet.EndTime; hour.AddHours(1))
                {
                    freeHours.Add(hour);
                }
            }

            //todo


            return new FreeReservedHoursDto(reservedHours, freeHours);
        }

        //creating valid reservation
        public async Task<string> CreateReservation(CreateReservationDto dto)
        {
            //todo check if user wants to pay now - if no, change status to PENDING, if yes, ask on frontend if he wants to use his wallet - if yes, pay from wallet+normal if he does not have cash, if no, everything stays as it is



            //check if there is timesheet for this date
            var timesheet = await _reservationTimesheetsService.GetTimesheetByDateAndObjectId(dto.ReservationDate, dto.ObjectId);
            if (timesheet == null)
                throw new Exception("There is no timesheet for that date, try again later");

            if (timesheet.IsTournament == true)
                throw new Exception("There is tournament on that day, please choose different date");

            //CHECK IF THERE IS ALREADY A RESERVATION FOR THESE HOURS (GET RESERVATIONS BY DAY AND OBJECT)
            if (await IsReservationDurationCorrect(dto.ReservationDate, dto.ReservationStart, dto.ReservationEnd, dto.ObjectId) == false)
                throw new Exception("Reservation hours intercept with each other, please change reservation hours");

            var reservation = _mapper.Map<Reservation>(dto);
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == dto.UserId) ?? throw new Exception("User not found");
            var objectType = await _context.ObjectTypes
                .FirstOrDefaultAsync(ot => ot.ObjectId == dto.ObjectId) ?? throw new Exception("Object not found");

            if (user.Role != Enums.Role.CLIENT)
                throw new Exception("User must be a Client to create reservation");

            reservation.ObjectType = objectType;
            reservation.User = user;
            reservation.ReservedAt = DateTime.Now;
            reservation.PaymentStatus = dto.IsPaid ? Enums.PaymentStatus.PAID : Enums.PaymentStatus.PENDING;

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return "Reservation created successfully";
        }
        public async Task<IEnumerable<ReservationDto>?> GetReservationsByUserIdAsync(int userId)
        {
            var reservations = await _context.Set<Reservation>()
                .Where(r => r.UserId == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ReservationDto>>(reservations);
        }
        public async Task<ReservationDto?> GetReservationsByIdAsync(int reservationId)
        {
            var reservation = await _context.Set<Reservation>()
                .Include(r => r.ObjectType)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ReservationId == reservationId);
              

            return _mapper.Map<ReservationDto>(reservation) ?? throw new Exception("Reservation does not exist");
        }

        public async Task<IEnumerable<Reservation>> GetReservationsByDateAndObject(DateOnly date, int objectId)
        {
            return await _context.Reservations
                .Where(r => r.ReservationDate == date)
                .Where(r => r.ObjectId == objectId)
                .ToListAsync();
        }

        public async Task<bool> IsReservationDurationCorrect(DateOnly date, TimeOnly resStart, TimeOnly resEnd, int objectId)
        {
            var reservations = await GetReservationsByDateAndObject(date, objectId);
            var timesheet = await _context.ReservationTimesheets
                .Where(rt => rt.Date == date)
                .Where(rt => rt.ObjectId == objectId)
                .FirstAsync();

            if (resStart < timesheet.StartTime || resStart > timesheet.EndTime || resEnd < timesheet.StartTime || resEnd > timesheet.EndTime)
                throw new Exception("Reservation hours do not contain in timesheet");

            foreach (var reservation in reservations)
            {
                if (resStart < reservation.ReservationEnd && resEnd > reservation.ReservationStart)
                    return false;
            }
            return true;
        }
    }
}
