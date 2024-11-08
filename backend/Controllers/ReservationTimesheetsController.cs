using backend.DTOs.ReservationTimesheet;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/reservation-timesheets")]
    [ApiController]
    public class ReservationTimesheetsController(IReservationTimesheetsService reservationTimesheetsService) : ControllerBase
    {
        private readonly IReservationTimesheetsService _reservationTimesheetsService = reservationTimesheetsService;

        [HttpPost("create")]
        [Authorize(Policy = "EmployeeOnly")]
        public async Task<IActionResult> CreateReservationTimesheet(CreateReservationTimesheetDto dto)
        {
            try
            {
                await _reservationTimesheetsService.CreateReservationTimesheet(dto);
                return Ok("Timesheet added successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
