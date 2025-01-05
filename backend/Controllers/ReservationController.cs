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

        [HttpGet("get-reservations-by-user-auth")]
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

        [HttpGet("users-reservations")]
        [Authorize(Policy = "AuthorizedOnly")]
        public async Task<IActionResult> GetReservationsByUserId([FromQuery] int userId)
        {
            try
            {
                var reservations = await _reservationsService.GetReservationsByUserIdAsync(userId);

                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpGet("users-reservations-paginated")]
        [Authorize(Policy = "AuthorizedOnly")]
        public async Task<IActionResult> GetReservationsByUserId(
            [FromQuery] int userId,
            [FromQuery] int page = 0,
            [FromQuery] int pageSize = 10)
        {
            if (page < 0 || pageSize < 1)
            {
                return BadRequest(new { Error = "Page must be >= 0 and PageSize must be greater than 0." });
            }

            try
            {
                var reservations = await _reservationsService.GetReservationsByUserIdPaginatedAsync(userId, page, pageSize);
                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpGet("reservations-by-id/{reservationId}")]
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
        [Authorize(Policy = "ClientOnly")]
        public async Task<IActionResult> CreateReservation([FromBody] CreateReservationDto dto)
        {
            try
            {
                var status = await _reservationsService.CreateReservation(dto);
                return Ok(new { Message = status });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpDelete("delete")]
        [Authorize(Policy = "ClientOnly")]
        public async Task<IActionResult> DeleteReservation([FromQuery] int reservationId)
        {
            try
            {
                await _reservationsService.DeleteReservation(reservationId);
                return Ok(new { Message = "Reservation deleted successfully" });
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

        //update reservation payment status
        [HttpPut("update-payment-status/{reservationId}")]
        [Authorize(Policy = "ClientOnly")]
        public async Task<IActionResult> UpdatePaymentStatus(int reservationId)
        {
            try
            {
                var result = await _reservationsService.UpdatePaymentStatusAsync(reservationId);
                if (result == null)
                {
                    return NotFound(new { Error = "Reservation not found." });
                }
                else if (result == false)
                {
                    return BadRequest(new { Error = "Reservation is already paid." });
                }
                return Ok(new { Message = "Payment status updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

    }
}
