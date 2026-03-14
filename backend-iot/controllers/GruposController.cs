using Microsoft.AspNetCore.Mvc;
using backend_iot.Models; // Para encontrar 'Grupo'
using backend_iot;        // Para encontrar 'MongoService' que está en la raíz
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

    [HttpGet]
    public async Task<ActionResult<List<Grupo>>> Get() 
    {
        return await _mongoService.GetGruposAsync();
    }

    [HttpPost]
    public async Task<IActionResult> Post(Grupo nuevoGrupo)
    {
        await _mongoService.CreateGrupoAsync(nuevoGrupo);
        return Ok(new { mensaje = "Grupo creado con éxito", id = nuevoGrupo.Id });
    }
}