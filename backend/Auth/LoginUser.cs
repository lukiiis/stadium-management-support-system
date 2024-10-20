using backend.Models;
using backend.Services;

namespace backend.Auth
{
    public sealed class LoginUser
    {
        private readonly IUsersService _usersService;
        private readonly PasswordHasher _passwordHasher;
        private readonly TokenProvider _tokenProvider;

        public LoginUser(IUsersService usersService, PasswordHasher passwordHasher, TokenProvider tokenProvider)
        {
            _usersService = usersService;
            _passwordHasher = passwordHasher;
            _tokenProvider = tokenProvider;
        }

        public sealed record Request(string Email, string Password);

        public async Task<string> Handle(Request request)
        {
            User? user = await _usersService.GetUserByEmail(request.Email);

            if (user == null)
            {
                throw new Exception("User was not found");
            }

            bool verified = _passwordHasher.Verify(request.Password, user.Password);

            if (!verified)
            {
                throw new Exception("Password is incorrect");
            }

            var token = _tokenProvider.Create(user);

            return token;
        }
    }
}