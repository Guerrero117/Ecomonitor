using Microsoft.AspNetCore.Mvc;
using backend_iot.Services;
using backend_iot.Models;

namespace backend_iot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        // Constructor: Conectamos con el servicio que usa MongoDB y BCrypt
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // ENDPOINT PARA LOGIN
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto request)
        {
            var token = _authService.Login(request.Email, request.Password);
            
            if (token == null)
            {
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            return Ok(new { token });
        }

        // ENDPOINT PARA REGISTRO
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            try 
            {
                await _authService.Register(user);
                return Ok(new { message = "Usuario registrado exitosamente en EcoMonitor" });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = "Error al registrar usuario", error = ex.Message });
            }
        }
    }

    // Esta pequeña clase sirve para recibir los datos del Login desde Angular
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}