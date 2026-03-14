using backend_iot.Models;
using MongoDB.Driver;
using BC = BCrypt.Net.BCrypt;

namespace backend_iot.Services
{
    public class AuthService : IAuthService
    {
        private readonly IMongoCollection<User> _users;

        public AuthService(IMongoDatabase database)
        {
            _users = database.GetCollection<User>("Users");
        }

        public string? Login(string email, string password)
        {
            var user = _users.Find(u => u.Email == email).FirstOrDefault();
            if (user != null && BC.Verify(password, user.Password))
            {
                return $"token-seguro-{user.Nombre}-{Guid.NewGuid()}";
            }
            return null;
        }

        public async Task Register(User newUser)
        {
            newUser.Password = BC.HashPassword(newUser.Password);
            await _users.InsertOneAsync(newUser);
        }
    }
}