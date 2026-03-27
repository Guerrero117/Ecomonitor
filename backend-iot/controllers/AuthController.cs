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
        private readonly IConfiguration _config; // Agregamos IConfiguration

        public AuthController(IAuthService authService, IConfiguration config)
        {
            _authService = authService;
            _config = config;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto request)
        {
            var user = _authService.Login(request.Email, request.Password);
            
            if (user == null)
            {
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            
            // SEGURIDAD: Obtenemos la llave desde el appsettings.json
            var jwtKey = _config["Jwt:Key"] ?? "EstaEsUnaLlavePorDefectoDe32Caracteres!";
            var key = Encoding.ASCII.GetBytes(jwtKey); 
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { 
                    new Claim(ClaimTypes.NameIdentifier, user.Id ?? ""), 
                    new Claim(ClaimTypes.Name, user.Nombre ?? "N/A"),
                    new Claim(ClaimTypes.Email, user.Email ?? "N/A"),
                    new Claim(ClaimTypes.Role, user.Rol ?? "user") 
                }),
                Expires = DateTime.UtcNow.AddHours(4),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { 
                id = user.Id, 
                nombre = user.Nombre,
                email = user.Email,
                rol = user.Rol,
                token = tokenString 
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            try 
            {
                // El servicio lanza una excepción si el correo ya existe
                await _authService.Register(user);
                return Ok(new { message = "Usuario registrado exitosamente" });
            }
            catch (System.Exception ex)
            {
                // MODIFICACIÓN: Enviamos ex.Message directamente para que Angular 
                // muestre "El correo electrónico ya está registrado"
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}