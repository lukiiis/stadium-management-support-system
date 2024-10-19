using backend.Models;

namespace backend.Services
{
    public interface IUsersService
    {
        Task<User?> GetUserByEmail(string email);
    }
}
