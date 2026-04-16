using Microsoft.AspNetCore.Mvc;
using backend_iot.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend_iot.Controllers
{
    [Authorize] // Seguridad OWASP: Solo usuarios con JWT válido
    [Route("api/[controller]")]
    [ApiController]
    public class SensorsController : ControllerBase
    {
        private readonly MongoService _mongoService;

        public SensorsController(MongoService mongoService)
        {
            _mongoService = mongoService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Sensor>>> Get()
        {
            // Extraemos el ID del usuario del Token de forma segura
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();
            
            return await _mongoService.GetSensorsPorUsuarioAsync(userId);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Sensor nuevoSensor)
        {
            // 1. Verificación de identidad
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            // 2. Validación estricta de hardware (Lista blanca OWASP)
            var tiposValidos = new List<string> { "Temperatura", "Humedad", "Calidad Aire", "Luminosidad" };
            if (!tiposValidos.Contains(nuevoSensor.Tipo))
                return BadRequest(new { mensaje = "Intento de registro de hardware no autorizado o no soportado." });

            // 3. Forzamos que el dueño del sensor sea quien envía la petición
            nuevoSensor.UsuarioId = userId;
            nuevoSensor.FechaRegistro = DateTime.Now;

            await _mongoService.CreateSensorAsync(nuevoSensor);
            return Ok(new { mensaje = "Sensor IoT registrado con éxito en el ecosistema" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var sensor = await _mongoService.GetSensorByIdAsync(id);
            
            if (sensor == null) return NotFound();
            
            // Seguridad OWASP: Impedir que un usuario borre sensores de otros
            if (sensor.UsuarioId != userId) return Forbid();

            await _mongoService.DeleteSensorAsync(id);
            return Ok(new { mensaje = "Dispositivo eliminado correctamente" });
        }
    }
}