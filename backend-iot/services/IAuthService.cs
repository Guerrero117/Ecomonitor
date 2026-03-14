using backend_iot.Models;

namespace backend_iot.Services
{
    public interface IAuthService
    {
        string? Login(string email, string password);
        Task Register(User newUser); 
    }
}