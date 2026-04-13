using Microsoft.AspNetCore.Mvc;
using backend_iot.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend_iot.Controllers
{
    [Authorize]
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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();
            
            return await _mongoService.GetSensorsPorUsuarioAsync(userId);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Sensor nuevoSensor)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            // Lista blanca extendida
            var tiposValidos = new List<string> { "Temperatura", "Humedad", "Calidad Aire", "Luminosidad" };
            if (!tiposValidos.Contains(nuevoSensor.Tipo))
                return BadRequest(new { mensaje = "Tipo de hardware no autorizado." });

            // Validación de Pin ocupado (Opcional pero recomendado)
            // Aquí podrías consultar si el Pin ya está en uso por otro sensor del mismo usuario

            nuevoSensor.UsuarioId = userId;
            nuevoSensor.FechaRegistro = DateTime.Now;

            await _mongoService.CreateSensorAsync(nuevoSensor);
            return Ok(new { mensaje = "Sensor IoT mapeado al Pin " + nuevoSensor.Pin + " con éxito." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var sensor = await _mongoService.GetSensorByIdAsync(id);
            
            if (sensor == null) return NotFound();
            if (sensor.UsuarioId != userId) return Forbid();

            await _mongoService.DeleteSensorAsync(id);
            return Ok(new { mensaje = "Dispositivo eliminado correctamente" });
        }
    }
}