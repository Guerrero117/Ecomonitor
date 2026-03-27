using Microsoft.AspNetCore.Mvc;
using backend_iot.Models;

namespace backend_iot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly MongoService _mongoService;

        public AdminController(MongoService mongoService)
        {
            _mongoService = mongoService;
        }

       [HttpGet("usuarios-detallados")]
public async Task<IActionResult> GetUsuariosDetallados()
{
    try 
    {
        var usuarios = await _mongoService.GetAllUsersAsync();
        var listaAdmin = new List<object>();

        foreach (var user in usuarios)
        {
            var userId = user.Id ?? "";
            var totalGrupos = await _mongoService.CountGruposByUsuarioAsync(userId);
            var totalSensores = await _mongoService.CountSensoresByUsuarioAsync(userId);

            listaAdmin.Add(new
            {
                Id = userId,
                Nombre = user.Nombre ?? "N/A",
                Email = user.Email ?? "N/A",
                Rol = user.Rol ?? "user",
                // PASAMOS LA FECHA AQUÍ
                Registro = user.FechaRegistro.ToString("dd/MM/yyyy"), 
                TotalGrupos = totalGrupos,
                TotalSensores = totalSensores
            });
        }
        return Ok(listaAdmin);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = ex.Message });
    }
}
    }
}