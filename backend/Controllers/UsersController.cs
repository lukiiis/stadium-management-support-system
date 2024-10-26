using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Auth;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;
        private readonly LoginUser _loginUser;
        private readonly RegisterUser _registerUser;

        public UsersController(IUsersService usersService, PasswordHasher passwordHasher, TokenProvider tokenProvider)
        {
            _usersService = usersService;
            _loginUser = new LoginUser(usersService, passwordHasher, tokenProvider);
            _registerUser = new RegisterUser(usersService, passwordHasher, tokenProvider);
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
        public async Task<IActionResult> Register([FromBody] RegisterUser.Request request)
        {
            try
            {
                string token = await _registerUser.RegisterClient(request);

                return Ok(new { message = "Account created succesfully", token });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
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
