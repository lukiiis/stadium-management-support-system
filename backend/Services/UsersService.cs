using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IUsersService
    {
        Task<User?> GetUserByEmail(string email);
        Task<bool> IsEmailTaken(string email);
        Task AddUser(User user);
    }

    public class UsersService : IUsersService
    {
        private readonly ApplicationDbContext _context;

        public UsersService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Set<User>()
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> IsEmailTaken(string email)
        {
            return await _context.Set<User>()
                .AnyAsync(u => u.Email == email);
        }
    }
}
