using backend.Models;
using backend.Services;

namespace backend.Auth
{
    public sealed class LoginUser(IUsersService usersService, PasswordHasher passwordHasher, TokenProvider tokenProvider)
    {
        private readonly IUsersService _usersService = usersService;
        private readonly PasswordHasher _passwordHasher = passwordHasher;
        private readonly TokenProvider _tokenProvider = tokenProvider;

        public sealed record Response(int UserId, string FirstName, string LastName, string Role, string Token, string Message);
        public sealed record Request(string Email, string Password);

        public async Task<Response> Handle(Request request)
        {
            User? user = await _usersService.GetUserByEmail(request.Email);

            if (user == null)
                throw new Exception("User was not found");

            bool verified = _passwordHasher.Verify(request.Password, user.Password);

            if (!verified)
                throw new Exception("Password is incorrect");

            if(user.Enabled == false)
                throw new Exception("Account is locked, please contact administration");

            var token = _tokenProvider.Create(user);

            return new Response (
                user.UserId,
                user.FirstName,
                user.LastName,
                user.Role.ToString(),
                token,
                "Login successful"
            );
        }
    }
}