using backend.Auth;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using static backend.Auth.LoginUser;
using System.Text.RegularExpressions;

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
        Task UpdatePasswordAsync(int id, string currentPassword, string newPassword, string confirmPassword);
    }

    public class UsersService(ApplicationDbContext context, PasswordHasher passwordHasher) : IUsersService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly PasswordHasher _passwordHasher = passwordHasher;

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

        public async Task UpdatePasswordAsync(int id, string currentPassword, string newPassword, string confirmPassword)
        {
            if (string.IsNullOrWhiteSpace(currentPassword) ||
                string.IsNullOrWhiteSpace(newPassword) ||
                string.IsNullOrWhiteSpace(confirmPassword))
            {
                throw new ArgumentException("All fields are required.");
            }

            if (newPassword.Length < 8)
                throw new ArgumentException("Password must be at least 8 characters long.");

            if (!Regex.IsMatch(newPassword, @"^(?=.*[A-Za-z])(?=.*\d).+$"))
                throw new ArgumentException("Password must contain both letters and numbers.");

            if (newPassword != confirmPassword)
                throw new ArgumentException("New password and confirm password do not match.");

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"User with ID {id} not found.");

            if (user.Password != _passwordHasher.HashPassword(currentPassword))
                throw new ArgumentException("Current password is incorrect.");

            user.Password = _passwordHasher.HashPassword(newPassword);
            await _context.SaveChangesAsync();
        }
    }
}
