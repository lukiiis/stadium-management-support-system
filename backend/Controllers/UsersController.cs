using Microsoft.AspNetCore.Mvc;
using backend.Auth;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController(IUsersService usersService, PasswordHasher passwordHasher, TokenProvider tokenProvider) : ControllerBase
    {
        private readonly IUsersService _usersService = usersService;
        private readonly LoginUser _loginUser = new(usersService, passwordHasher, tokenProvider);
        private readonly RegisterUser _registerUser = new(usersService, passwordHasher, tokenProvider);

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
        public async Task<IActionResult> Register([FromBody] RegisterUser.Request request)
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



        //works fine, for testing purpose
        //[HttpGet("auth/{email}")]
        //[Authorize(Policy = "ClientOnly")]
        //public async Task<IActionResult> GetByEmailAuth(string email)
        //{
        //    var user = await _usersService.GetUserByEmail(email);
        //    if (user == null)
        //        return NotFound();

        //    return Ok(user);
        //}
    }
}
