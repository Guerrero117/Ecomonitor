using Microsoft.AspNetCore.Mvc;
using backend_iot.Services;
using backend_iot.Models;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace backend_iot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _config;
        private readonly MongoService _mongoService; // Inyectamos MongoService para los logs

        public AuthController(IAuthService authService, IConfiguration config, MongoService mongoService)
        {
            _authService = authService;
            _config = config;
            _mongoService = mongoService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var user = _authService.Login(request.Email, request.Password);
            
            if (user == null) {
                // OWASP A09:2021 - Registro de intento fallido
                await _mongoService.RegistrarLogAsync(null, "LOGIN_FAILED", $"Intento de acceso fallido para: {request.Email}");
                return Unauthorized(new { message = "Credenciales inválidas" });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? _config["Jwt:Key"];
            var key = Encoding.ASCII.GetBytes(jwtKey); 
            
            string userRole = user.Rol?.Equals("admin", StringComparison.OrdinalIgnoreCase) == true 
                              ? "Admin" 
                              : (user.Rol ?? "user");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { 
                    new Claim(ClaimTypes.NameIdentifier, user.Id ?? ""), 
                    new Claim(ClaimTypes.Name, user.Nombre ?? ""),
                    new Claim(ClaimTypes.Email, user.Email ?? ""),
                    new Claim(ClaimTypes.Role, userRole) 
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            
            // Registro de éxito
            await _mongoService.RegistrarLogAsync(user.Id, "LOGIN_SUCCESS", $"Sesión iniciada por el usuario: {user.Email}");

            return Ok(new { 
                id = user.Id, 
                nombre = user.Nombre,
                rol = user.Rol,
                token = tokenHandler.WriteToken(token) 
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            try {
                await _authService.Register(user);
                await _mongoService.RegistrarLogAsync(null, "USER_REGISTER", $"Nuevo usuario registrado: {user.Email}");
                return Ok(new { message = "Registro exitoso" });
            }
            catch (System.Exception ex) {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class LoginDto {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}