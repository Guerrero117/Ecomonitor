using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace backend_iot.Models
{
    public class Medicion
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public float? Temperatura { get; set; }
        public float? Humedad { get; set; }
        public bool HayLluvia { get; set; }
        public double VoltajeGas { get; set; }
        public double VoltajeLuz { get; set; }
        public string DispositivoId { get; set; } = "RPI_OBREGON_01";
        public DateTime Fecha { get; set; } = DateTime.Now;
    }
}