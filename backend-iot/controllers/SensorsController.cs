using Microsoft.AspNetCore.Mvc;
using backend_iot.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend_iot.Controllers
{
    [Authorize] // <--- Nadie entra sin Token
    [Route("api/[controller]")]
    [ApiController]
    public class SensorsController : ControllerBase
    {
        private readonly MongoService _mongoService;

        public SensorsController(MongoService mongoService)
        {
            _mongoService = mongoService;
        }

        // GET: api/sensors 
        // Ahora solo devuelve los sensores del usuario logueado
        [HttpGet]
        public async Task<ActionResult<List<Sensor>>> Get()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var sensores = await _mongoService.GetSensorsPorUsuarioAsync(userId);
            return Ok(sensores);
        }

        // POST: api/sensors
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Sensor nuevoSensor)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            nuevoSensor.UsuarioId = userId; // Forzamos que el dueño sea el del Token

            await _mongoService.CreateSensorAsync(nuevoSensor);
            return Ok(new { mensaje = "Sensor guardado y vinculado a tu cuenta" });
        }

        // DELETE: api/sensors/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Verificamos propiedad antes de borrar (Protección OWASP)
            var sensor = await _mongoService.GetSensorByIdAsync(id);
            if (sensor == null) return NotFound();
            if (sensor.UsuarioId != userId) return Forbid(); // Intentó borrar algo ajeno

            await _mongoService.DeleteSensorAsync(id);
            return Ok(new { mensaje = "Sensor eliminado correctamente" });
        }
    }
}