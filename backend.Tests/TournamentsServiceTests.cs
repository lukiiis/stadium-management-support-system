using AutoMapper;
using backend.Data;
using backend.DTOs.Tournament;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using System.Linq;
using System.Linq.Expressions;

namespace backend.Tests
{
    public class TournamentsServiceTests
    {
        private readonly ITournamentsService _tournamentsService;
        private readonly ApplicationDbContext _context;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IUsersService> _usersServiceMock;
        private readonly Mock<IReservationTimesheetsService> _reservationTimesheetsServiceMock;
        private readonly Mock<IReservationsService> _reservationsServiceMock;

        public TournamentsServiceTests()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _context = new ApplicationDbContext(options);
            _mapperMock = new Mock<IMapper>();
            _usersServiceMock = new Mock<IUsersService>();
            _reservationTimesheetsServiceMock = new Mock<IReservationTimesheetsService>();
            _reservationsServiceMock = new Mock<IReservationsService>();

            _tournamentsService = new TournamentsService(
                _usersServiceMock.Object,
                _reservationTimesheetsServiceMock.Object,
                _reservationsServiceMock.Object,
                _context,
                _mapperMock.Object
            );
        }

        [Fact]
        public async Task CreateTournament_ShouldThrowException_WhenStartDateIsLaterThanEndDate()
        {
            var dto = new CreateTournamentDto
            {
                StartDate = DateOnly.FromDateTime(DateTime.Now.AddDays(1)),
                EndDate = DateOnly.FromDateTime(DateTime.Now)
            };

            var exception = await Assert.ThrowsAsync<Exception>(() => _tournamentsService.CreateTournament(dto));
            Assert.Equal("Start tournament date can't be later than end tournament date", exception.Message);
        }

        [Fact]
        public async Task CreateTournament_ShouldThrowException_WhenTournamentDateRangeIsNotAvailable()
        {
            var dto = new CreateTournamentDto
            {
                StartDate = DateOnly.FromDateTime(DateTime.Now),
                EndDate = DateOnly.FromDateTime(DateTime.Now.AddDays(1)),
                ObjectId = 1
            };

            _context.Tournaments.Add(new Tournament
            {
                StartDate = DateOnly.FromDateTime(DateTime.Now),
                EndDate = DateOnly.FromDateTime(DateTime.Now.AddDays(1)),
                ObjectType = new ObjectType { Type = "TestType", Description = "TestDescription" },
                Description = "Test Tournament",
                Sport = "Test Sport"
            });
            await _context.SaveChangesAsync();

            var exception = await Assert.ThrowsAsync<Exception>(() => _tournamentsService.CreateTournament(dto));
            Assert.Equal("There is already an existing tournament for that date, choose other dates", exception.Message);
        }

    }
}
