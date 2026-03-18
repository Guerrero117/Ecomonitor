using Microsoft.AspNetCore.Mvc;
using backend_iot.Models;
using backend_iot;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class GruposController : ControllerBase
{
    private readonly MongoService _mongoService;

    public GruposController(MongoService mongoService)
    {
        _mongoService = mongoService;
    }

    // GET: api/grupos/{userId}
    [HttpGet("{userId}")]
    public async Task<ActionResult<List<Grupo>>> Get(string userId) 
    {
        return await _mongoService.GetGruposPorUsuarioAsync(userId);
    }

    // POST: api/grupos
    [HttpPost]
    public async Task<IActionResult> Post(Grupo nuevoGrupo)
    {
        if (string.IsNullOrEmpty(nuevoGrupo.UsuarioId))
        {
            return BadRequest(new { mensaje = "El ID de usuario es requerido para crear un grupo." });
        }

        await _mongoService.CreateGrupoAsync(nuevoGrupo);
        return Ok(new { mensaje = "Grupo creado con éxito", id = nuevoGrupo.Id });
    }
}