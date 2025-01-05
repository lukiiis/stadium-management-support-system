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
                return Ok(new { Message = "Timesheet added successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPut("update")]
        [Authorize(Policy = "EmployeeOnly")]
        public async Task<IActionResult> UpdateReservationTimesheet(UpdateReservationTimesheetDto dto)
        {
            try
            {
                await _reservationTimesheetsService.UpdateReservationTimesheet(dto);
                return Ok(new { Message = "Timesheet updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpGet("all-paginated")]
        [Authorize(Policy = "EmployeeOnly")]
        public async Task<IActionResult> GetAllTimesheetsPaginated(int page = 1, int pageSize = 10)
        {
            try
            {
                var result = await _reservationTimesheetsService.GetAllTimesheetsPaginatedAsync(page, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
