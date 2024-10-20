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

        public sealed record ClientRequest(
            [property: JsonPropertyName("first_name")] string FirstName,
            [property: JsonPropertyName("last_name")] string LastName,
            [property: JsonPropertyName("age")] int Age,
            [property: JsonPropertyName("phone")] int Phone,
            [property: JsonPropertyName("email")] string Email,
            [property: JsonPropertyName("password")] string Password);
        public sealed record AdminRequest(string FirstName, string LastName, int Age, int Phone, string Email, string Password, string Seniority, double Salary);
        public sealed record EmployeeRequest(string FirstName, string LastName, int Age, int Phone, string Email, string Password, string Position, double Salary);


        public async Task<string> RegisterClient(ClientRequest request)
        {
            //string validation = await ValidateRequest(request);
            //if (validation != "OK")
            //    return validation;

            return "todo";
        }

        private async Task<string> ValidateRequest(ClientRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.FirstName))
                return "First name cannot be empty.";

            if (string.IsNullOrWhiteSpace(request.LastName))
                return "Last name cannot be empty.";

            if (!Regex.IsMatch(request.Phone.ToString(), @"^\d{9,9}$"))
                return "Phone number must be between 9 and 15 digits.";

            if (!IsValidEmail(request.Email))
                return "Invalid email address.";

            if (await _usersService.IsEmailTaken(request.Email))
                return "Email is already registered.";

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
