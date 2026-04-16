using backend_iot.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend_iot.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicionesController : ControllerBase
    {
        private readonly IMongoCollection<Medicion> _mediciones;

        public MedicionesController(IMongoDatabase database)
        {
            // Usamos el nombre de la colección que vimos en tu Atlas
            _mediciones = database.GetCollection<Medicion>("Mediciones");
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Medicion nuevaMedicion)
        {
            try {
                nuevaMedicion.Fecha = DateTime.UtcNow;
                await _mediciones.InsertOneAsync(nuevaMedicion);
                return Ok(new { mensaje = "Datos recibidos correctamente" });
            } catch (Exception ex) {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<Medicion>>> Get() =>
            await _mediciones.Find(Builders<Medicion>.Filter.Empty).SortByDescending(m => m.Fecha).Limit(50).ToListAsync();

        // MÉTODO CORREGIDO PARA EVITAR EL ERROR CS1660
        [HttpGet("detectados")]
        public async Task<ActionResult<List<string>>> GetDispositivosDetectados()
        {
            try {
                // Definimos un filtro vacío explícitamente para que el compilador esté feliz
                var filtroVacio = Builders<Medicion>.Filter.Empty;
                
                // Usamos el nombre exacto de tu base de datos: "DispositivoId"
                var dispositivos = await _mediciones.Distinct<string>("DispositivoId", filtroVacio).ToListAsync();
                
                return Ok(dispositivos);
            } catch (Exception ex) {
                return StatusCode(500, $"Error al detectar: {ex.Message}");
            }
        }
    }
}