using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace backend_iot.Models
{
    public class Sensor
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        // Validación OWASP: Longitud mínima y máxima para evitar inyecciones de strings masivos
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(50, MinimumLength = 3)]
        [BsonElement("Nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [BsonElement("Tipo")] 
        public string Tipo { get; set; } = "Temperatura";

        // Nueva propiedad para que coincida con lo que el usuario elige en el Dashboard
        [BsonElement("Unidad")]
        public string Unidad { get; set; } = string.Empty;

        [Range(1, 3600, ErrorMessage = "La frecuencia debe ser entre 1 y 3600 segundos")]
        [BsonElement("Frecuencia")]
        public int Frecuencia { get; set; } = 10; 

        [BsonElement("Estado")]
        public bool Estado { get; set; } = true;

        [BsonElement("FechaRegistro")]
        public DateTime FechaRegistro { get; set; } = DateTime.Now;

        // Vinculación estricta con el usuario autenticado
        [BsonElement("UsuarioId")]
        public string UsuarioId { get; set; } = string.Empty; 
    }
}