using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.DTOs.Tournament;
using backend.Services;
using Humanizer;

namespace backend.Controllers
{
    [Route("api/tournaments")]
    [ApiController]
    public class TournamentsController(ITournamentsService tournamentsService) : ControllerBase
    {
        private readonly ITournamentsService _tournamentsService = tournamentsService;

        //add tournament by an employee
        [HttpPost("create")]
        [Authorize(Policy = "EmployeeOnly")]
        public async Task<IActionResult> CreateTournament(CreateTournamentDto dto)
        {
            try
            {
                if (dto == null)
                    throw new ArgumentNullException(nameof(dto));

                await _tournamentsService.CreateTournament(dto);

                return Ok(new { Message = "Tournament created successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("join")]
        [Authorize(Policy = "ClientOnly")]
        public async Task<IActionResult> JoinTournament([FromBody] JoinTournamentDto dto)
        {
            try
            {
                await _tournamentsService.JoinTournamentAsync(dto);
                return Ok(new { message = "User successfully joined the tournament." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("leave")]
        [Authorize(Policy = "ClientOnly")]
        public async Task<IActionResult> LeaveTournament([FromBody] LeaveTournamentDto dto)
        {
            try
            {
                await _tournamentsService.LeaveTournamentAsync(dto);
                return Ok(new { Message = "You successfully left the tournament." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        //get users tournaments
        [HttpGet("joined-tournaments")]
        [Authorize(Policy = "AuthorizedOnly")]
        public async Task<IActionResult> GetUserTournaments([FromQuery] int userId)
        {
            try
            {
                var tournaments = await _tournamentsService.GetUserTournamentsAsync(userId);
                return Ok(tournaments);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpGet("joined-tournaments-paginated")]
        [Authorize(Policy = "AuthorizedOnly")]
        public async Task<IActionResult> GetUserTournamentsPaginated(
            [FromQuery] int userId,
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 10)
        {
            if (page < 0 || pageSize < 1)
            {
                return BadRequest(new { Error = "Page and PageSize must be greater than 0." });
            }

            try
            {
                var result = await _tournamentsService.GetUserTournamentsPaginatedAsync(userId, page, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpGet("all-tournaments-paginated")]
        public async Task<IActionResult> GetAllTournamentsPaginated(
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var paginatedTournaments = await _tournamentsService.GetAllTournamentsPaginatedAsync(page, pageSize);
                return Ok(paginatedTournaments);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }


        //get all tournaments
        [HttpGet]
        public async Task<IActionResult> GetAllTournaments()
        {
            try
            {
                var tournaments = await _tournamentsService.GetAllTournaments();

                return Ok(tournaments);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        //get all not started tournaments
        [HttpGet("not-started")]
        public async Task<IActionResult> GetAllNotStartedTournaments()
        {
            try
            {
                var tournaments = await _tournamentsService.GetAllNotStartedTournaments();

                return Ok(tournaments);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpGet("{objectId}")]
        public async Task<IActionResult> GetAllTournamentsByObjectId(int objectId)
        {
            try
            {
                var tournaments = await _tournamentsService.GetAllTournamentsByObjectId(objectId);

                return Ok(tournaments);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
