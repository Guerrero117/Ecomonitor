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
            // Buscamos al usuario por email
            var user = _users.Find(u => u.Email == email).FirstOrDefault();
            
            // Verificamos si existe y si la contraseña es correcta
            if (user != null && BC.Verify(password, user.Password))
            {
                // Devolvemos el objeto usuario (que ya trae su Id de MongoDB)
                return user;
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