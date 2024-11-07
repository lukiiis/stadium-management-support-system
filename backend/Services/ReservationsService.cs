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

        public async Task<string> CreateReservation(CreateReservationDto dto)
        {
            var reservation = _mapper.Map<Reservation>(dto);
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == dto.UserId) ?? throw new Exception("User not found.");
            var objectType = await _context.ObjectTypes
                .FirstOrDefaultAsync(ot => ot.ObjectId == dto.ObjectId) ?? throw new Exception("Object not found.");

            //todo if user is not a CLIENT, he cant reserve
            
            //todo CHECK IF THERE IS ALREADY A RESERVATION FOR THESE HOURS (GET RESERVATIONS BY DAY AND OBJECT)

            reservation.ObjectType = objectType;
            reservation.User = user;
            reservation.ReservedAt = DateTime.Now;
            reservation.PaymentStatus = dto.IsPaid ? Enums.PaymentStatus.PAID : Enums.PaymentStatus.PENDING;

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return "Reservation created successfully.";
        }

        public bool IsReservationDurationCorrect(DateOnly date, TimeOnly start, TimeOnly end, int objectId)
        {
            // check if hours are ok and not overlapping with already in database
            return false;
        }
    }
}
