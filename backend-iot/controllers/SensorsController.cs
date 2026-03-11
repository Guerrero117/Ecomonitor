using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using backend_iot.Models;

namespace backend_iot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorsController : ControllerBase
    {
        private readonly IMongoCollection<Sensor> _sensorsCollection;

        public SensorsController(IMongoDatabase database)
        {
            _sensorsCollection = database.GetCollection<Sensor>("Sensors");
        }

        [HttpGet]
        public async Task<ActionResult<List<Sensor>>> Get()
        {
            var sensores = await _sensorsCollection.Find(_ => true).ToListAsync();
            return Ok(sensores);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Sensor nuevoSensor)
        {
            await _sensorsCollection.InsertOneAsync(nuevoSensor);
            return Ok(new { mensaje = "Sensor vinculado con éxito" });
        }
    }
}