using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend_iot.Models
{
    public class Sensor
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("Nombre")]
        public string Nombre { get; set; } = string.Empty;

        [BsonElement("Tipo")]
        public string Tipo { get; set; } = "Temperatura";

        [BsonElement("Frecuencia")]
        public int Frecuencia { get; set; } = 9;

        [BsonElement("Estado")]
        public bool Estado { get; set; } = true;

        [BsonElement("FechaRegistro")]
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
    }
}