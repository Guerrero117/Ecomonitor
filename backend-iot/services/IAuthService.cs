using backend_iot.Models;

namespace backend_iot.Services
{
    public interface IAuthService
    {
        // Ahora devuelve el objeto Usuario completo si las credenciales son válidas
        User? Login(string email, string password);
        Task Register(User newUser); 
    }
}