using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend_iot.Models
{
    public class Sensor
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Nombre { get; set; } = string.Empty;
        public string Tipo { get; set; } = "Temperatura";
        public int Frecuencia { get; set; } = 9;
        public bool Estado { get; set; } = true;
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
    }
}