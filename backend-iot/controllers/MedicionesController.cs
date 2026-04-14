using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using EcoMonitor.Models;

namespace EcoMonitor.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicionesController : ControllerBase
    {
        private readonly IMongoCollection<Medicion> _mediciones;

        public MedicionesController(IMongoClient client)
        {
            var database = client.GetDatabase("EcoMonitorDB");
            // La coleccion en MongoDB tambien se llamara Mediciones
            _mediciones = database.GetCollection<Medicion>("Mediciones");
        }

        // Recibe datos de la Raspberry Pi
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Medicion nuevaMedicion)
        {
            await _mediciones.InsertOneAsync(nuevaMedicion);
            return Ok(new { mensaje = "Medicion guardada exitosamente" });
        }

        // Envia datos a Angular
        [HttpGet]
        public async Task<ActionResult<List<Medicion>>> Get()
        {
            return await _mediciones.Find(m => true).Limit(20).ToListAsync();
        }
    }
}