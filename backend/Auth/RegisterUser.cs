using backend.Models;
using backend.Services;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace backend.Auth
{
    public sealed class RegisterUser
    {
        private readonly IUsersService _usersService;
        private readonly PasswordHasher _passwordHasher;
        private readonly TokenProvider _tokenProvider;

        public RegisterUser(IUsersService usersService, PasswordHasher passwordHasher, TokenProvider tokenProvider)
        {
            _usersService = usersService;
            _passwordHasher = passwordHasher;
            _tokenProvider = tokenProvider;
        }

        public sealed record Request(
            [property: JsonPropertyName("first_name")] string FirstName,
            [property: JsonPropertyName("last_name")] string LastName,
            [property: JsonPropertyName("age")] int Age,
            [property: JsonPropertyName("phone")] int Phone,
            [property: JsonPropertyName("email")] string Email,
            [property: JsonPropertyName("password")] string Password,
            [property: JsonPropertyName("role")] string Role
            );

        public async Task<string> RegisterClient(Request request)
        {
            string validation = await ValidateRequest(request);
            if (validation != "OK")
                throw new Exception(validation);

            User user = new()
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Age = request.Age,
                Phone = request.Phone,
                Email = request.Email,
                Password = _passwordHasher.HashPassword(request.Password),
                Role = request.Role == "ADMIN" ? Role.ADMIN : request.Role == "EMPLOYEE" ? Role.EMPLOYEE : Role.CLIENT,
                Wallet = request.Role == "CLIENT" ? 0.0 : null
            };

            await _usersService.AddUser(user);

            var token = _tokenProvider.Create(user);

            return token;
        }

        private async Task<string> ValidateRequest(Request request)
        {
            if (string.IsNullOrWhiteSpace(request.FirstName))
                return "First name cannot be empty.";

            if (string.IsNullOrWhiteSpace(request.LastName))
                return "Last name cannot be empty.";

            if (!Regex.IsMatch(request.Phone.ToString(), @"^\d{9,9}$"))
                return "Phone number must be between 9 and 15 digits.";

            if (await _usersService.IsPhoneTaken(request.Phone))
                return "Provided phone number is taken.";

            if (!IsValidEmail(request.Email))
                return "Invalid email address.";

            if (await _usersService.IsEmailTaken(request.Email))
                return "Provided email is taken.";

            if (request.Password.Length < 8)
                return "Password must be at least 8 characters long.";

            if (!Regex.IsMatch(request.Password, @"^(?=.*[A-Za-z])(?=.*\d).+$"))
                return "Password must contain both letters and numbers.";

            return "OK";
        }

        private static bool IsValidEmail(string email)
        {
            var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            return emailRegex.IsMatch(email);
        }
    }
}
