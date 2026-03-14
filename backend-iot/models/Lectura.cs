using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend_iot.Models
{
    public class Lectura
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("SensorId")] // Para saber a qué sensor pertenece esta lectura
        public string SensorId { get; set; } = string.Empty;

        [BsonElement("Valor")]
        public double Valor { get; set; }

        [BsonElement("Unidad")] // "°C", "%", "ppm"
        public string Unidad { get; set; } = string.Empty;

        [BsonElement("FechaHora")]
        public DateTime FechaHora { get; set; } = DateTime.Now;
    }
}