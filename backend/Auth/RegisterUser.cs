using backend.Enums;
using backend.Models;
using backend.Services;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace backend.Auth
{
    public sealed class RegisterUser(IUsersService usersService, PasswordHasher passwordHasher, TokenProvider tokenProvider)
    {
        private readonly IUsersService _usersService = usersService;
        private readonly PasswordHasher _passwordHasher = passwordHasher;
        private readonly TokenProvider _tokenProvider = tokenProvider;

        public sealed record ClientRequest(string FirstName, string LastName, int Age, int Phone, string Email, string Password, string RePassword, string Role);
        public sealed record EmployeeRequest(string FirstName, string LastName, int Age, int Phone, string Email, double Salary, string Position);
        public sealed record Response(string Message);

        public async Task<Response> RegisterClient(ClientRequest request)
        {
            string validation = await ValidateClientRequest(request);
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
                CreatedAt = DateTime.Today,
                Role = request.Role == "ADMIN" ? Role.ADMIN : request.Role == "EMPLOYEE" ? Role.EMPLOYEE : Role.CLIENT,
                Wallet = request.Role == "CLIENT" ? 0.0 : null,
                Enabled = true
            };

            await _usersService.AddUser(user);

            //var token = _tokenProvider.Create(user);

            return new Response("Success! You can now log in");
        }

        public async Task<Response> RegisterEmployee(EmployeeRequest request)
        {
            string validation = await ValidateEmployeeRequest(request);
            if (validation != "OK")
                throw new Exception(validation);

            User user = new()
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Age = request.Age,
                Phone = request.Phone,
                Email = request.Email,
                Position = request.Position,
                Salary = request.Salary,
                Password = _passwordHasher.HashPassword("employee"),
                CreatedAt = DateTime.Today,
                Role = Role.EMPLOYEE,
                Wallet = null,
                Enabled = true,
                Address = null,
            };

            await _usersService.AddUser(user);


            return new Response("Employee created successfully");
        }

        private async Task<string> ValidateEmployeeRequest(EmployeeRequest request)
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

            return "OK";
        }

        private async Task<string> ValidateClientRequest(ClientRequest request)
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

            if (request.Password.Length < 8)
                return "Password must be at least 8 characters long.";

            if (!Regex.IsMatch(request.Password, @"^(?=.*[A-Za-z])(?=.*\d).+$"))
                return "Password must contain both letters and numbers.";

            if (request.Password != request.RePassword)
                return "Passwords do not match.";

            return "OK";
        }

        private static bool IsValidEmail(string email)
        {
            var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            return emailRegex.IsMatch(email);
        }
    }
}
