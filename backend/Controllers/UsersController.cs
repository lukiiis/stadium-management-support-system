using Microsoft.AspNetCore.Mvc;
using backend.Auth;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.DTOs.User;

namespace backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController(IUsersService usersService, PasswordHasher passwordHasher, TokenProvider tokenProvider) : ControllerBase
    {
        private readonly IUsersService _usersService = usersService;
        private readonly LoginUser _loginUser = new(usersService, passwordHasher, tokenProvider);
        private readonly RegisterUser _registerUser = new(usersService, passwordHasher, tokenProvider);

        [HttpGet("get-all")]
        //[Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _usersService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("paginated/get-all")]
        public async Task<IActionResult> GetUsersPaginated([FromQuery] int page = 0, [FromQuery] int pageSize = 10)
        {
            var result = await _usersService.GetUsersPaginatedAsync(page, pageSize);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUser.Request request)
        {
            try
            {
                var response = await _loginUser.Handle(request);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUser.ClientRequest request)
        {
            try
            {
                var response = await _registerUser.RegisterClient(request);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("register-employee")]
        //[Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> RegisterEmployee([FromBody] RegisterUser.EmployeeRequest request)
        {
            try
            {
                var response = await _registerUser.RegisterEmployee(request);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPut("{userId}/block")]
        //[Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> BlockUser(int userId)
        {
            try
            {
                await _usersService.BlockUserAsync(userId);
                return Ok(new { Message = "User has been blocked." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPut("{userId}/unblock")]
        //[Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UnblockUser(int userId)
        {
            try
            {
                await _usersService.UnblockUserAsync(userId);
                return Ok(new { Message = "User has been unblocked." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // change password for users
        [HttpPatch("{id}/password")]
        //[Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdatePassword(int id, [FromBody] UpdatePasswordDto request)
        {
            try
            {
                await _usersService.UpdatePasswordAsync(id, request.CurrentPassword, request.NewPassword, request.ConfirmPassword);
                return Ok(new { Message = "Password updated successfully." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { Error = ex.Message });
            }
        }

        // update profile information
        [HttpPut("update-personal-data")]
        //[Authorize(Policy = "AuthorizedOnly")]
        public async Task<IActionResult> UpdateUserDetails([FromBody] UpdatePersonalDataDto request)
        {
            try
            {
                await _usersService.UpdateUserDetailsAsync(request);

                return Ok(new { Message = "Account details updated successfully." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Error = ex.Message });
            }
        }

        [HttpPost("is-valid/{email}")]
        public async Task<IActionResult> IsEmailTaken(string email)
        {
            var user = await _usersService.GetUserByEmail(email);
            if (user == null)
                return Ok(true);

            return Ok(false);
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            var user = await _usersService.GetUserByEmail(email);
            if (user == null)
                return NotFound();

            return Ok(user);
        }
    }
}
