using Microsoft.AspNetCore.Mvc;
using backend_iot.Services;
using backend_iot.Models;

namespace backend_iot.Controllers
{
    // --- 1. La Dirección de la Ventanilla ---
    [ApiController]
    // Esto dice que para llegar aquí, la dirección en internet será: api/Auth
    [Route("api/[controller]")] 
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        // --- 2. Conectando al Experto ---
        // Aquí el controlador dice: "Yo solo atiendo, necesito que el experto 
        // en seguridad (AuthService) esté aquí conmigo para validar las claves".
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // --- 3. El Buzón de Login ---
        // [HttpPost("login")] significa que aquí recibimos sobres con información.
        // [FromBody] es como decir: "Abre el sobre y saca los datos del Login (Email y Pass)".
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto request)
        {
            // Le pasamos los datos al experto para que haga su magia con BCrypt
            var token = _authService.Login(request.Email, request.Password);
            
            // Si el experto dice que no coinciden (token es null)...
            if (token == null)
            {
                // Le respondemos a Angular con un error 401 (No tienes permiso)
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            // Si el experto dice que todo está papa (OK)...
            // Le regresamos su token con un código 200 (Éxito)
            return Ok(new { token });
        }
    }
}