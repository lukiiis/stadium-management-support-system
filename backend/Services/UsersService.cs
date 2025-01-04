using backend.Auth;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using static backend.Auth.LoginUser;
using System.Text.RegularExpressions;
using backend.DTOs.User;
using Microsoft.AspNetCore.Mvc.RazorPages;
using AutoMapper;
using backend.Services.Pagination;
using backend.Enums;

namespace backend.Services
{
    public interface IUsersService
    {
        Task BlockUserAsync(int userId);
        Task UnblockUserAsync(int userId);
        Task<User?> GetUserByEmail(string email);
        Task<bool> IsEmailTaken(string email, string userEmail);
        Task<bool> IsPhoneTaken(int phone);
        Task AddUser(User user);
        Task<User?> GetUserById(int id);
        Task UpdatePasswordAsync(int id, string currentPassword, string newPassword, string confirmPassword);
        Task UpdateUserDetailsAsync(UpdatePersonalDataDto request);
        Task<UserDto> GetUserDtoById(int id);
        Task<List<UserDto>> GetAllUsersAsync();
        Task<PaginatedResult<UserDto>> GetUsersPaginatedAsync(int page, int pageSize);
        Task PromoteToAdmin(int userId);
    }

    public class UsersService(ApplicationDbContext context, PasswordHasher passwordHasher, IMapper mapper) : IUsersService
    {
        private readonly ApplicationDbContext _context = context;
        private readonly PasswordHasher _passwordHasher = passwordHasher;
        private readonly IMapper _mapper = mapper;

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

        public async Task PromoteToAdmin(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");
            if (user.Role != Role.EMPLOYEE) throw new Exception("User is not an employee");

            user.Role = Role.ADMIN;
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

        public async Task<bool> IsEmailTaken(string email, string userEmail)
        {
            return await _context.Set<User>()
                .AnyAsync(u => u.Email == email && u.Email != userEmail);
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

        public async Task UpdateUserDetailsAsync(UpdatePersonalDataDto request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
                throw new KeyNotFoundException($"User with ID {request.UserId} not found.");

            if (string.IsNullOrWhiteSpace(request.FirstName) || string.IsNullOrWhiteSpace(request.LastName))
                throw new ArgumentException("First name and last name are required.");
            if (request.Age < 0)
                throw new ArgumentException("Age must be a positive number.");
            if (!IsValidEmail(request.Email))
                throw new ArgumentException("Invalid email format.");
            if (!Regex.IsMatch(request.Phone.ToString(), @"^\d{9,9}$"))
                throw new ArgumentException("Invalid phone number format.");

            if (await IsEmailTaken(request.Email, user.Email))
                throw new ArgumentException("Email is already in use.");

            if (await IsPhoneTaken(request.Phone) && request.Phone != user.Phone)
                throw new ArgumentException("Phone number is already in use.");

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Age = request.Age;
            user.Phone = request.Phone;
            user.Email = request.Email;

            await _context.SaveChangesAsync();
        }

        private static bool IsValidEmail(string email)
        {
            var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            return emailRegex.IsMatch(email);
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _context.Users.Include(u => u.Address).ToListAsync();
            return _mapper.Map<List<UserDto>>(users);
        }

        public async Task<PaginatedResult<UserDto>> GetUsersPaginatedAsync(int page, int pageSize)
        {
            var totalUsers = await _context.Users.CountAsync();
            var users = await _context.Users
                .Include(u => u.Address)
                .OrderBy(u => u.UserId)
                .Skip((page) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = _mapper.Map<List<UserDto>>(users);

            return new PaginatedResult<UserDto>
            {
                TotalCount = totalUsers,
                Page = page,
                PageSize = pageSize,
                Items = userDtos
            };
        }

        public async Task<UserDto> GetUserDtoById(int id)
        {
            var user = await _context.Users.Include(u => u.Address).Where(u => u.UserId == id).FirstOrDefaultAsync();
            return _mapper.Map<UserDto>(user);
        }
    }
}
