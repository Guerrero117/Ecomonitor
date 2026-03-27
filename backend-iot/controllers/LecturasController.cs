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
        var sensor = await _sensores.Find(s => s.Id == nuevaLectura.SensorId).FirstOrDefaultAsync();
        
        if (sensor == null) return NotFound("Error: El sensor especificado no existe.");

        // VALIDACIÓN DE UNIDADES PARA TUS SENSORES REALES (FC-22 y Fotoreceptor)
        bool esValido = sensor.Tipo.ToLower() switch
        {
            "temperatura"  => nuevaLectura.Unidad == "°C",
            "humedad"      => nuevaLectura.Unidad == "%",
            "co2"          => nuevaLectura.Unidad == "ppm",
            "calidad aire" => nuevaLectura.Unidad == "ppm", // Sensor FC-22
            "luminosidad"  => nuevaLectura.Unidad == "lux", // Fotoreceptor
            _ => true 
        };

        if (!esValido) 
            return BadRequest($"Error: El sensor {sensor.Nombre} no admite la unidad {nuevaLectura.Unidad}.");

        nuevaLectura.FechaHora = DateTime.Now;
        await _lecturas.InsertOneAsync(nuevaLectura);
        return Ok(new { message = "Lectura científica registrada", id = nuevaLectura.Id });
    }

    [HttpGet("sensor/{sensorId}")]
    public async Task<List<Lectura>> GetBySensor(string sensorId)
    {
        return await _lecturas.Find(l => l.SensorId == sensorId)
                             .SortByDescending(l => l.FechaHora)
                             .Limit(20)
                             .ToListAsync();
    }

    [HttpGet("grupo/{grupoId}")]
    public async Task<IActionResult> GetByGrupo(string grupoId)
    {
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