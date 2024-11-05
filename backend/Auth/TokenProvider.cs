using backend.Models;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Auth
{
    public class TokenProvider(IConfiguration configuration)
    {
        public string Create(User user)
        {
            string secretKey = configuration["Jwt:Secret"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    [
                        new Claim(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                        new Claim(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Email, user.Email),
                        new Claim(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Name, $"{user.FirstName} {user.LastName}"),
                        new Claim("role", user.Role.ToString()),
                    ]),
                Expires = DateTime.UtcNow.AddMinutes(configuration.GetValue<int>("Jwt:ExpirationInMinutes")),
                SigningCredentials = credentials,
                Issuer = configuration["Jwt:Issuer"],
                Audience = configuration["Jwt:Audience"]
            };

            var handler = new JsonWebTokenHandler();

            string token = handler.CreateToken(tokenDescriptor);

            return token;
        }

        public int ExtractUserIdFromToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();

            if (handler.ReadToken(token) is not JwtSecurityToken jwtToken)
            {
                throw new Exception("Invalid token format.");
            }

            var userIdClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Sub);
            return userIdClaim == null ? throw new Exception("UserId claim is missing.") : int.Parse(userIdClaim.Value);
        }
    }
}
