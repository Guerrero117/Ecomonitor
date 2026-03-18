using Microsoft.AspNetCore.Mvc;
using backend_iot.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend_iot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorsController : ControllerBase
    {
        private readonly MongoService _mongoService;

        // Inyectamos el MongoService que ya configuramos en Program.cs
        public SensorsController(MongoService mongoService)
        {
            _mongoService = mongoService;
        }

        // 1. GET: api/sensors (Trae todos los sensores del sistema)
        [HttpGet]
        public async Task<ActionResult<List<Sensor>>> Get()
        {
            var sensores = await _mongoService.GetSensorsAsync();
            return Ok(sensores);
        }

        // 2. GET: api/sensors/user/{userId} (EL QUE NECESITA ANGULAR)
        // Este es el que llena tu tabla filtrando por el dueño
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Sensor>>> GetByUser(string userId)
        {
            var sensores = await _mongoService.GetSensorsPorUsuarioAsync(userId);
            return Ok(sensores);
        }

        // 3. POST: api/sensors (Para guardar nuevos sensores)
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Sensor nuevoSensor)
        {
            if (string.IsNullOrEmpty(nuevoSensor.UsuarioId))
            {
                return BadRequest(new { mensaje = "El ID de usuario es obligatorio" });
            }

            await _mongoService.CreateSensorAsync(nuevoSensor);
            return Ok(new { mensaje = "Sensor vinculado con éxito" });
        }

        // 4. DELETE: api/sensors/{id} (Para borrar sensores)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _mongoService.DeleteSensorAsync(id);
            return Ok(new { mensaje = "Sensor eliminado" });
        }
    }
}