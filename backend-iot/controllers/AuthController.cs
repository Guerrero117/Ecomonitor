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

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto request)
        {
            var user = _authService.Login(request.Email, request.Password);
            
            if (user == null)
            {
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            // --- GENERACIÓN DE JWT REAL ---
            var tokenHandler = new JwtSecurityTokenHandler();
            // IMPORTANTE: Esta clave DEBE ser la misma que en Program.cs
            var key = Encoding.ASCII.GetBytes("EstaEsUnaLlaveSuperSecretaDe32Caracteres!"); 
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { 
                    new Claim(ClaimTypes.NameIdentifier, user.Id ?? ""), 
                    new Claim(ClaimTypes.Name, user.Nombre),
                    new Claim(ClaimTypes.Email, user.Email)
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
                token = tokenString 
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            try 
            {
                await _authService.Register(user);
                return Ok(new { message = "Usuario registrado exitosamente" });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = "Error al registrar", error = ex.Message });
            }
        }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}