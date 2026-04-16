using Microsoft.AspNetCore.Mvc;
using backend_iot.Models;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace backend_iot.Controllers
{
    [ApiController]
    [Authorize(Roles = "Admin,admin")] 
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
                    string fechaFormateada = user.FechaRegistro == DateTime.MinValue 
                        ? "Sin fecha" 
                        : user.FechaRegistro.ToLocalTime().ToString("dd/MM/yyyy");

                    listaAdmin.Add(new
                    {
                        Id = userId,
                        Nombre = user.Nombre ?? "N/A",
                        Email = user.Email ?? "N/A",
                        Rol = user.Rol ?? "user",
                        Registro = fechaFormateada, 
                        TotalGrupos = await _mongoService.CountGruposByUsuarioAsync(userId),
                        TotalSensores = await _mongoService.CountSensoresByUsuarioAsync(userId)
                    });
                }
                return Ok(listaAdmin);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Error al obtener usuarios." });
            }
        }

        [HttpGet("auditoria")]
        public async Task<IActionResult> GetAuditoria()
        {
            try 
            {
                var logs = await _mongoService.GetLogsRecientesAsync();
                
                var logsFormateados = logs.Select(l => new {
                    l.Id,
                    l.UsuarioId,
                    l.Accion,
                    l.Detalle,
                    l.Ip,
                    Fecha = l.Fecha.ToLocalTime().ToString("dd/MM/yyyy HH:mm:ss")
                });

                return Ok(logsFormateados);
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "No se pudo cargar el historial de auditoría." });
            }
        }
    }
}