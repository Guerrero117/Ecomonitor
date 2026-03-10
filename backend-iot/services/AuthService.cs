using backend_iot.Models;
using BCrypt.Net;

namespace backend_iot.Services
{
    // Aquí le decimos que esta clase va a cumplir con el contrato (IAuthService)
    public class AuthService : IAuthService
    {
        // --- 1. El Usuario de Prueba ---
        // Imagina que esto es nuestra base de Datos por ahora.
        // Guardamos el email normal, pero la contraseña "Eco123!" no la guardamos tal cual.
        // Usamos BCrypt.HashPassword para que en la memoria se vea como un chorro de letras y números locos.
        private readonly User _testUser = new User 
        { 
            Email = "octavio@eco.com", 
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Eco123!") 
        };

        // --- 2. El proceso de Login ---
        public string? Login(string email, string password)
        {
            // Primero: ¿El correo que escribió el usuario es el mismo que tenemos?
            // Si no es, le decimos "Naranjas" (null) de una vez.
            if (email != _testUser.Email) return null;

            // --- 3. La magia de BCrypt ---
            // Aquí viene lo bueno. No podemos comparar "Eco123!" directamente con el código secreto.
            // BCrypt.Verify toma la clave que escribió el usuario, le hace un proceso matemático
            // y checa si coincide con el Hash que tenemos guardado.
            bool isValid = BCrypt.Net.BCrypt.Verify(password, _testUser.PasswordHash);

            // Si la clave fue correcta (isValid), le damos su "pase de entrada" (Token).
            // Si no, devolvemos null para que el sistema sepa que falló.
            return isValid ? "TOKEN_PRUEBA_EXITOSO_OK" : null;
        }
    }
}