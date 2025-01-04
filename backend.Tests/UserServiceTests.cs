using AutoMapper;
using backend.Auth;
using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace backend.Tests
{
    public class UsersServiceTests
    {
        private readonly UsersService _usersService;
        private readonly ApplicationDbContext _context;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<PasswordHasher> _passwordHasherMock;

        public UsersServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _context = new ApplicationDbContext(options);
            _mapperMock = new Mock<IMapper>();
            _passwordHasherMock = new Mock<PasswordHasher>();
            _usersService = new UsersService(_context, _passwordHasherMock.Object, _mapperMock.Object);
        }

        [Fact]
        public async Task GetUserByEmail_ShouldReturnUser_WhenUserExists()
        {
            var email = "test@example.com";
            var user = new User
            {
                Email = email,
                FirstName = "Test",
                LastName = "User",
                Password = "password123"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var result = await _usersService.GetUserByEmail(email);

            Assert.NotNull(result);
            Assert.Equal(email, result.Email);
        }

        [Fact]
        public async Task IsEmailTaken_ShouldReturnTrue_WhenEmailIsTaken()
        {
            var email = "test@example.com";
            var user = new User
            {
                Email = email,
                FirstName = "Test",
                LastName = "User",
                Password = "password123"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var result = await _usersService.IsEmailTaken(email, "another@example.com");

            Assert.True(result);
        }
    }
}
