using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace backend_iot.Models
{
    public class Lectura
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("SensorId")]
        public string SensorId { get; set; } = string.Empty;

        [BsonElement("Valor")]
        public double Valor { get; set; }

        [BsonElement("Unidad")] // "ppm" para FC-22, "lux" para Fotoreceptor
        public string Unidad { get; set; } = string.Empty;

        [BsonElement("FechaHora")]
        public DateTime FechaHora { get; set; } = DateTime.Now;
    }
}