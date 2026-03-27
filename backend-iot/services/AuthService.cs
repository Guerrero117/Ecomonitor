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

        public User? Login(string email, string password)
        {
            var user = _users.Find(u => u.Email == email).FirstOrDefault();
            
            if (user != null && BC.Verify(password, user.Password))
            {
                return user;
            }
            return null;
        }

        public async Task Register(User newUser)
        {
            // Validar duplicados
            var existingUser = await _users.Find(u => u.Email == newUser.Email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                throw new Exception("Este correo ya está en uso.");
            }

            // Seguridad: Por defecto siempre es 'user'
            newUser.Rol = "user"; 
            
            newUser.Password = BC.HashPassword(newUser.Password);
            await _users.InsertOneAsync(newUser);
        }
    }
}