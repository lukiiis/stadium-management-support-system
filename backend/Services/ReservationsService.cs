using AutoMapper;
using backend.Data;
using backend.DTOs.Reservation;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IReservationsService
    {
        Task<string> CreateReservation(CreateReservationDto dto);
        Task<ReservationDto?> GetReservationsByIdAsync(int reservationId);
        Task<IEnumerable<ReservationDto>?> GetReservationsByUserIdAsync(int userId);
    }

    public class ReservationsService(ApplicationDbContext context, IMapper mapper) : IReservationsService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IMapper _mapper = mapper;

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

        //creating valid reservation
        public async Task<string> CreateReservation(CreateReservationDto dto)
        {
            var reservation = _mapper.Map<Reservation>(dto);
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == dto.UserId) ?? throw new Exception("User not found");
            var objectType = await _context.ObjectTypes
                .FirstOrDefaultAsync(ot => ot.ObjectId == dto.ObjectId) ?? throw new Exception("Object not found");

            if (user.Role != Enums.Role.CLIENT)
                throw new Exception("User must be a Client to create reservation");

            //CHECK IF THERE IS ALREADY A RESERVATION FOR THESE HOURS (GET RESERVATIONS BY DAY AND OBJECT)
            if (await IsReservationDurationCorrect(dto.ReservationDate, dto.ReservationStart, dto.ReservationEnd, objectType.ObjectId) == false)
                throw new Exception("Reservation hours intercept with each other, please change reservation hours");

            reservation.ObjectType = objectType;
            reservation.User = user;
            reservation.ReservedAt = DateTime.Now;
            reservation.PaymentStatus = dto.IsPaid ? Enums.PaymentStatus.PAID : Enums.PaymentStatus.PENDING;

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return "Reservation created successfully";
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
