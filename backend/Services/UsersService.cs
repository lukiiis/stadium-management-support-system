using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

namespace backend.Services
{
    public interface IUsersService
    {
        Task BlockUserAsync(int userId);
        Task UnblockUserAsync(int userId);
        Task<User?> GetUserByEmail(string email);
        Task<bool> IsEmailTaken(string email);
        Task<bool> IsPhoneTaken(int phone);
        Task AddUser(User user);
        Task<User?> GetUserById(int id);
    }

    public class UsersService(ApplicationDbContext context) : IUsersService
    {
        private readonly ApplicationDbContext _context = context;

        public async Task BlockUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");

            if (user.Enabled == false) throw new Exception("User is already blocked");

            user.Enabled = false;
            await _context.SaveChangesAsync();
        }

        public async Task UnblockUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");

            if (user.Enabled == true) throw new Exception("User is already unblocked");

            user.Enabled = true;
            await _context.SaveChangesAsync();
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

        public async Task<bool> IsPhoneTaken(int phone)
        {
            return await _context.Set<User>()
                .AnyAsync(u => u.Phone == phone);
        }
        public async Task<User?> GetUserById(int id)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == id);
        }
    }
}
