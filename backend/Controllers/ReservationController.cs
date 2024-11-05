using backend.Auth;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;

namespace backend.Controllers
{
    [Route("api/reservations")]
    [ApiController]
    public class ReservationController(IReservationsService reservationsService, TokenProvider tokenProvider) : ControllerBase
    {
        private readonly IReservationsService _reservationsService = reservationsService;
        private readonly TokenProvider _tokenProvider = tokenProvider;

        [HttpGet("get-reservations-by-user")]
        [Authorize(Policy = "ClientOnly")]
        public async Task<IActionResult> GetReservationsByUserIdAuth()
        {
            try
            {
                var token = HttpContext.Request.Headers.Authorization.ToString()["Bearer ".Length..].Trim();
                var userId = _tokenProvider.ExtractUserIdFromToken(token);


                var reservations = await _reservationsService.GetReservationsByUserIdAsync(userId);

                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpGet("get-reservations-by-id/{reservationId}")]
        [Authorize(Policy = "AuthorizedOnly")]
        public async Task<IActionResult> GetReservationsByIdAuth(int reservationId)
        {
            try
            {
                var reservation = await _reservationsService.GetReservationsByIdAsync(reservationId);

                return Ok(reservation);
            }
            catch (Exception ex)
            {
                return NotFound(new { Error = ex.Message });
            }
        }
    }
}
