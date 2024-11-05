using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.DTOs.Tournament;
using backend.Services;

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
        public async Task<IActionResult> CreateTournament(TournamentCreateDto dto)
        {
            try
            {
                if (dto == null)
                    throw new ArgumentNullException(nameof(dto));

                await _tournamentsService.CreateTournament(dto);

                return Ok("Tournament created successfully");
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
