using backend.Models;
using backend.Services;

namespace backend.Auth
{
    internal sealed class LoginUser(UsersService usersService, PasswordHasher passwordHasher, TokenProvider tokenProvider)
    {
        public sealed record Request(string Email, string Password);

        public async Task<string> Handle(Request request)
        {
            User? user = await usersService.GetUserByEmail(request.Email);

            if (user == null)
            {
                throw new Exception("User was not found");
            }

            bool verified = passwordHasher.Verify(request.Password, user.Password);

            if (!verified)
            {
                throw new Exception("Password is incorrect");
            }

            var token = tokenProvider.Create(user);

            return token;
        }
    }
}
