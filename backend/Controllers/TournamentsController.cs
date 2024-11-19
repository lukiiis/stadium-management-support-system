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
        //[Authorize(Policy = "EmployeeOnly")]
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
        //[Authorize(Policy = "ClientOnly")]
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
        //[Authorize(Policy = "ClientOnly")]
        public async Task<IActionResult> LeaveTournament([FromBody] LeaveTournamentDto dto)
        {
            try
            {
                await _tournamentsService.LeaveTournamentAsync(dto);
                return Ok(new { Message = "User has successfully left the tournament." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        //get users tournaments
        [HttpGet("joined-tournaments")]
        public async Task<IActionResult> GetUserTournaments([FromQuery] int userId)
        {
            try
            {
                var tournaments = await _tournamentsService.GetUserTournamentsAsync(userId);
                //if (tournaments == null || !tournaments.Any())
                //{
                //    return NotFound(new { Message = "User is not registered for any tournaments." });
                //}

                return Ok(tournaments);
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

        //private readonly ApplicationDbContext _context;

        //public TournamentsController(ApplicationDbContext context)
        //{
        //    _context = context;
        //}

        //// GET: api/Tournaments
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Tournament>>> GetTournament()
        //{
        //    return await _context.Tournament.ToListAsync();
        //}

        //// GET: api/Tournaments/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<Tournament>> GetTournament(int id)
        //{
        //    var tournament = await _context.Tournament.FindAsync(id);

        //    if (tournament == null)
        //    {
        //        return NotFound();
        //    }

        //    return tournament;
        //}

        //// PUT: api/Tournaments/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutTournament(int id, Tournament tournament)
        //{
        //    if (id != tournament.TournamentId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(tournament).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!TournamentExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //// POST: api/Tournaments
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<Tournament>> PostTournament(Tournament tournament)
        //{
        //    _context.Tournament.Add(tournament);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetTournament", new { id = tournament.TournamentId }, tournament);
        //}

        //// DELETE: api/Tournaments/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteTournament(int id)
        //{
        //    var tournament = await _context.Tournament.FindAsync(id);
        //    if (tournament == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Tournament.Remove(tournament);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        //private bool TournamentExists(int id)
        //{
        //    return _context.Tournament.Any(e => e.TournamentId == id);
        //}
    }
}
