using backend.Auth;
using backend.DTOs.Reservation;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        //create reservation (endpoint for clients)
        [HttpPost("create")]
        //[Authorize(Policy = "ClientOnly")]
        public async Task<IActionResult> CreateReservation(CreateReservationDto dto)
        {
            try
            {
                //add token extraction and send the Id to the function (only for prod)

                var status = await _reservationsService.CreateReservation(dto);
                return Ok(status);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpGet("reservation-schedule-day")]
        public async Task<IActionResult> GetFreeAndReservedHours([FromQuery] DateOnly date, [FromQuery] int objectId)
        {
            try
            {
                var result = await _reservationsService.GetReservationScheduleForOneDay(date, objectId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("reservation-schedule-week")]
        public async Task<IActionResult> GetWeeklyTimesheets([FromQuery] DateOnly startDate, [FromQuery] int objectId)
        {
            try
            {
                var timesheets = await _reservationsService.GetReservationScheduleForOneWeek(startDate, objectId);
                return Ok(timesheets);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
