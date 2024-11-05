using AutoMapper;
using backend.Data;
using backend.DTOs.Reservation;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IReservationsService
    {
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
    }
}
