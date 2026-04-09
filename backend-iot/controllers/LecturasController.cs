using Microsoft.AspNetCore.Mvc;
using backend_iot.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class LecturasController : ControllerBase
{
    private readonly IMongoCollection<Lectura> _lecturas;
    private readonly IMongoCollection<Sensor> _sensores;
    private readonly IMongoCollection<Grupo> _grupos;

    public LecturasController(IMongoDatabase database)
    {
        _lecturas = database.GetCollection<Lectura>("Lecturas");
        _sensores = database.GetCollection<Sensor>("Sensores");
        _grupos = database.GetCollection<Grupo>("Grupos");
    }

    [HttpPost]
    public async Task<IActionResult> Post(Lectura nuevaLectura)
    {
        // SEGURIDAD: Validar formato hexadecimal de 24 caracteres antes de buscar
        if (!MongoDB.Bson.ObjectId.TryParse(nuevaLectura.SensorId, out _))
        {
            return BadRequest("Error: El ID del sensor no tiene un formato hexadecimal válido.");
        }

        var sensor = await _sensores.Find(s => s.Id == nuevaLectura.SensorId).FirstOrDefaultAsync();
        if (sensor == null) return NotFound("Error: El sensor especificado no existe.");

        // VALIDACIÓN ORIGINAL (FC-22, Fotoreceptor, etc)
        bool esValido = sensor.Tipo.ToLower() switch
        {
            "temperatura"  => nuevaLectura.Unidad == "°C",
            "humedad"      => nuevaLectura.Unidad == "%",
            "co2"          => nuevaLectura.Unidad == "ppm",
            "calidad aire" => nuevaLectura.Unidad == "ppm", 
            "luminosidad"  => nuevaLectura.Unidad == "lux",
            _ => true 
        };

        if (!esValido) 
            return BadRequest($"Error: El sensor {sensor.Nombre} no admite la unidad {nuevaLectura.Unidad}.");

        nuevaLectura.FechaHora = DateTime.Now;
        await _lecturas.InsertOneAsync(nuevaLectura);
        return Ok(new { message = "Lectura científica registrada", id = nuevaLectura.Id });
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> PostBulk([FromBody] List<Lectura> lecturas)
    {
        if (lecturas == null || lecturas.Count == 0) return BadRequest("Lista vacía.");

        foreach (var l in lecturas)
        {
            l.FechaHora = DateTime.Now;
            l.EsManual = true;
            l.Origen = "Manual_Batch";
        }

        await _lecturas.InsertManyAsync(lecturas);
        return Ok(new { message = "Registros múltiples persistidos" });
    }

    [HttpGet("sensor/{sensorId}")]
    public async Task<List<Lectura>> GetBySensor(string sensorId)
    {
        if (!MongoDB.Bson.ObjectId.TryParse(sensorId, out _)) return new List<Lectura>();

        return await _lecturas.Find(l => l.SensorId == sensorId)
                             .SortByDescending(l => l.FechaHora)
                             .Limit(20)
                             .ToListAsync();
    }

    [HttpGet("grupo/{grupoId}")]
    public async Task<IActionResult> GetByGrupo(string grupoId)
    {
        // SEGURIDAD: Evitar excepción FormatException
        if (!MongoDB.Bson.ObjectId.TryParse(grupoId, out _))
        {
            return BadRequest("El ID del grupo proporcionado no es un ObjectId válido.");
        }

        var grupo = await _grupos.Find(g => g.Id == grupoId).FirstOrDefaultAsync();
        if (grupo == null) return NotFound("Grupo no encontrado.");

        var lecturasGrupo = await _lecturas
            .Find(l => grupo.SensoresIds.Contains(l.SensorId))
            .SortByDescending(l => l.FechaHora)
            .Limit(50) 
            .ToListAsync();

        return Ok(lecturasGrupo);
    }
}