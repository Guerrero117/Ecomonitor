using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace EcoMonitor.Models
{
    public class Medicion
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public double Temperatura { get; set; }
        public double Humedad { get; set; }
        public bool HayLluvia { get; set; }
        public bool GasDetectado { get; set; }
        public bool EsOscuro { get; set; }
        public string DispositivoId { get; set; } = "RPI_OBREGON_01";
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
    }
}