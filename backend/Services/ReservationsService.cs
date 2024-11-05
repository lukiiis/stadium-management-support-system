using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IReservationsService
    {
        Task<Reservation?> GetReservationsByIdAsync(int reservationId);
        Task<IEnumerable<Reservation>?> GetReservationsByUserIdAsync(int userId);
    }

    public class ReservationsService(ApplicationDbContext context) : IReservationsService
    {
        private readonly ApplicationDbContext _context = context;

        public async Task<IEnumerable<Reservation>?> GetReservationsByUserIdAsync(int userId)
        {
            return await _context.Set<Reservation>()
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }
        public async Task<Reservation?> GetReservationsByIdAsync(int reservationId)
        {
            var reservation = await _context.Set<Reservation>()
                .Include(r => r.ObjectType)
                .FirstOrDefaultAsync(r => r.ReservationId == reservationId);
              

            return reservation ?? throw new Exception("Reservation does not exist");
        }
    }
}
