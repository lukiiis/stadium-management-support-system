using System.Security.Cryptography;
using System.Text;

namespace backend.Auth
{
    public class PasswordHasher
    {
        public bool Verify(string reqPassword, string userPassword)
        {
            string hashedReqPassword = HashPassword(reqPassword);

            return hashedReqPassword == userPassword;
        }
        private string HashPassword(string password)
        {
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);

            byte[] hashBytes = SHA256.HashData(passwordBytes);

            StringBuilder hashString = new();
            foreach (byte b in hashBytes)
            {
                hashString.Append(b.ToString("x2"));
            }

            return hashString.ToString();
        }
    }
}