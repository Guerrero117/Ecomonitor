using Xunit;
using backend_iot.Services;

namespace backend_iot.Tests
{
    public class AuthServiceTests
    {
        // PRUEBA 1: Verificar que el camino funcione
        [Fact]
        public void Login_DebeRetornarToken_CuandoDatosSonCorrectos()
        {
            // ARREGLAR: Preparamos el escenario conociendo el código interno
            var servicio = new AuthService();
            var correo = "octavio@eco.com";
            var clave = "Eco123!";

            // ACTUAR: Ejecutamos el método
            var resultado = servicio.Login(correo, clave);

            // AFIRMAR: Verificamos que el resultado sea el token esperado
            Assert.Equal("TOKEN_PRUEBA_EXITOSO_OK", resultado);
        }

        // PRUEBA 2: Verificar que el "bloqueo" funcione (Seguridad)
        [Fact]
        public void Login_DebeRetornarNull_CuandoClaveEsIncorrecta()
        {
            // ARREGLAR: Sabemos que cualquier otra clave debe fallar
            var servicio = new AuthService();
            var correo = "octavio@eco.com";
            var claveFalsa = "PasswordErroneo";

            // ACTUAR
            var resultado = servicio.Login(correo, claveFalsa);

            // AFIRMAR: Como es caja blanca, sabemos que BCrypt.Verify debe dar 'false'
            // y el código debe retornar 'null'.
            Assert.Null(resultado);
        }
    }
}