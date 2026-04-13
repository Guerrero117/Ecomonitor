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

        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(50, MinimumLength = 3)]
        [BsonElement("Nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [BsonElement("Tipo")] 
        public string Tipo { get; set; } = "Temperatura";

        [BsonElement("Modelo")]
        public string Modelo { get; set; } = string.Empty;

        [BsonElement("Unidad")]
        public string Unidad { get; set; } = string.Empty;

        // Nuevo: Pin físico en la Raspberry Pi
        [Range(0, 40, ErrorMessage = "Pin GPIO inválido")]
        [BsonElement("Pin")]
        public int Pin { get; set; }

        [Range(1, 3600, ErrorMessage = "La frecuencia debe ser entre 1 y 3600 segundos")]
        [BsonElement("Frecuencia")]
        public int Frecuencia { get; set; } = 10; 

        [BsonElement("Estado")]
        public bool Estado { get; set; } = true;

        [BsonElement("FechaRegistro")]
        public DateTime FechaRegistro { get; set; } = DateTime.Now;

        [BsonElement("UsuarioId")]
        public string UsuarioId { get; set; } = string.Empty; 
    }
}