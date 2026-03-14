using Microsoft.AspNetCore.Mvc;
using backend_iot.Models;   // <--- ASEGÚRATE DE QUE DIGA backend_iot
using MongoDB.Driver;
using backend_iot;

[ApiController]
[Route("api/[controller]")]
public class LecturasController : ControllerBase
{
    private readonly IMongoCollection<Lectura> _lecturas;
    private readonly IMongoCollection<Sensor> _sensores; // Necesitamos esto para validar
    private readonly IMongoCollection<Grupo> _grupos;   // Necesitamos esto para filtrar

    public LecturasController(IMongoDatabase database)
    {
        _lecturas = database.GetCollection<Lectura>("Lecturas");
        _sensores = database.GetCollection<Sensor>("Sensores");
        _grupos = database.GetCollection<Grupo>("Grupos");
    }

    [HttpPost]
    public async Task<IActionResult> Post(Lectura nuevaLectura)
    {
        // --- VALIDACIÓN DE SEGURIDAD ---
        var sensor = await _sensores.Find(s => s.Id == nuevaLectura.SensorId).FirstOrDefaultAsync();
        
        if (sensor == null) return NotFound("El sensor no existe.");

        // Validar que la unidad coincida con el tipo de sensor
        bool esValido = sensor.Tipo.ToLower() switch
        {
            "temperatura" => nuevaLectura.Unidad == "°C",
            "humedad" => nuevaLectura.Unidad == "%",
            "co2" => nuevaLectura.Unidad == "ppm",
            _ => true // Si no conocemos el tipo, dejamos pasar
        };

        if (!esValido) 
            return BadRequest($"Error: Un sensor de {sensor.Tipo} no puede registrar unidades en {nuevaLectura.Unidad}.");

        await _lecturas.InsertOneAsync(nuevaLectura);
        return Ok(new { message = "Dato guardado correctamente y validado." });
    }

    // --- NUEVO: OBTENER LECTURAS DE TODO UN GRUPO ---
    [HttpGet("grupo/{grupoId}")]
    public async Task<IActionResult> GetByGrupo(string grupoId)
    {
        var grupo = await _grupos.Find(g => g.Id == grupoId).FirstOrDefaultAsync();
        if (grupo == null) return NotFound("Grupo no encontrado.");

        // Buscamos todas las lecturas cuyos SensorId estén en la lista del grupo
        var lecturasGrupo = await _lecturas
            .Find(l => grupo.SensoresIds.Contains(l.SensorId))
            .SortByDescending(l => l.FechaHora)
            .Limit(50) 
            .ToListAsync();

        return Ok(lecturasGrupo);
    }

    [HttpGet("{sensorId}")]
    public async Task<List<Lectura>> GetBySensor(string sensorId)
    {
        return await _lecturas.Find(l => l.SensorId == sensorId)
                             .SortByDescending(l => l.FechaHora)
                             .Limit(10)
                             .ToListAsync();
    }
}