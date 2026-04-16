using Microsoft.AspNetCore.Mvc;
using backend_iot.Models;
using backend_iot;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend_iot.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GruposController : ControllerBase
    {
        private readonly MongoService _mongoService;
        private readonly IMongoCollection<Medicion> _mediciones;

        public GruposController(MongoService mongoService, IMongoDatabase database)
        {
            _mongoService = mongoService;
            _mediciones = database.GetCollection<Medicion>("Mediciones");
        }

        [HttpGet]
        public async Task<ActionResult<List<Grupo>>> Get() 
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            return await _mongoService.GetGruposPorUsuarioAsync(userId);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Grupo nuevoGrupo)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            nuevoGrupo.UsuarioId = userId;

            try {
                await _mongoService.CreateGrupoAsync(nuevoGrupo);
                return Ok(new { mensaje = "Grupo creado con éxito", id = nuevoGrupo.Id });
            } catch (System.Exception ex) {
                return BadRequest(new { error = ex.Message });
            }
        }

        // NUEVO: Trae la última medición de cada sensor que pertenece a este grupo
        [HttpGet("{id}/lecturas")]
        public async Task<IActionResult> GetLecturasGrupo(string id)
        {
            var grupo = await _mongoService.GetGrupoByIdAsync(id); // Asumiendo que existe este método en tu Service
            if (grupo == null) return NotFound();

            var resultados = new List<Medicion>();
            foreach (var sId in grupo.SensoresIds)
            {
                var ultima = await _mediciones.Find(m => m.DispositivoId == sId)
                                              .SortByDescending(m => m.Fecha)
                                              .FirstOrDefaultAsync();
                if (ultima != null) resultados.Add(ultima);
            }
            return Ok(resultados);
        }
    }
}