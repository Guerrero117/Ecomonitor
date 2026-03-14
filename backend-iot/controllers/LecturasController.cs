using backend_iot.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

[ApiController]
[Route("api/[controller]")]
public class LecturasController : ControllerBase
{
    private readonly IMongoCollection<Lectura> _lecturas;

    public LecturasController(IMongoDatabase database)
    {
        _lecturas = database.GetCollection<Lectura>("Lecturas");
    }

    // Este es el que usaremos para la "Entrada Manual"
    [HttpPost]
    public async Task<IActionResult> Post(Lectura nuevaLectura)
    {
        await _lecturas.InsertOneAsync(nuevaLectura);
        return Ok(new { message = "Dato guardado correctamente" });
    }

    // Este servirá para las gráficas del Dashboard
    [HttpGet("{sensorId}")]
    public async Task<List<Lectura>> GetBySensor(string sensorId)
    {
        return await _lecturas.Find(l => l.SensorId == sensorId)
                             .SortByDescending(l => l.FechaHora)
                             .Limit(10) // Traer las últimas 10
                             .ToListAsync();
    }
}