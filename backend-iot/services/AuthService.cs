using backend_iot.Models;
using BCrypt.Net;

namespace backend_iot.Services
{
    public class AuthService : IAuthService
    {
        private readonly User _testUser = new User 
        { 
            Email = "octavio@eco.com", 
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Eco123!") 
        };

        public string? Login(string email, string password)
        {
            if (email != _testUser.Email) return null;

            bool isValid = BCrypt.Net.BCrypt.Verify(password, _testUser.PasswordHash);

            return isValid ? "TOKEN_PRUEBA_EXITOSO_OK" : null;
        }
    }
}