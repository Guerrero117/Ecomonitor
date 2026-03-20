using Microsoft.AspNetCore.Mvc;
using backend_iot.Models;
using backend_iot;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend_iot.Controllers
{
    [Authorize] // Bloquea acceso si no hay Token
    [ApiController]
    [Route("api/[controller]")]
    public class GruposController : ControllerBase
    {
        private readonly MongoService _mongoService;

        public GruposController(MongoService mongoService)
        {
            _mongoService = mongoService;
        }

        // GET: api/grupos
        [HttpGet]
        public async Task<ActionResult<List<Grupo>>> Get() 
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { mensaje = "Usuario no identificado" });

            return await _mongoService.GetGruposPorUsuarioAsync(userId);
        }

        // POST: api/grupos
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Grupo nuevoGrupo)
        {
            // Extraemos el ID del dueño desde el Token JWT
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { mensaje = "Sesión inválida o expirada" });

            // Asignamos el ID internamente
            nuevoGrupo.UsuarioId = userId;

            try 
            {
                await _mongoService.CreateGrupoAsync(nuevoGrupo);
                return Ok(new { mensaje = "Grupo creado con éxito", id = nuevoGrupo.Id });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { mensaje = "Error en base de datos", error = ex.Message });
            }
        }
    }
}