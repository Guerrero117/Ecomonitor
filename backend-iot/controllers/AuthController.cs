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

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto request)
        {
            // Obtenemos el usuario completo
            var user = _authService.Login(request.Email, request.Password);
            
            if (user == null)
            {
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            // Generamos un token ficticio (puedes usar JWT aquí luego)
            var tokenGenerado = $"token-seguro-{user.Nombre}-{Guid.NewGuid()}";

            // RESPUESTA PARA ANGULAR: Enviamos el ID, el nombre y el token
            return Ok(new { 
                id = user.Id, 
                nombre = user.Nombre,
                email = user.Email,
                token = tokenGenerado 
            });
        }

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

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}