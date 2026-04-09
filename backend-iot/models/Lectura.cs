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

        [BsonElement("Unidad")] 
        public string Unidad { get; set; } = string.Empty;

        [BsonElement("FechaHora")]
        public DateTime FechaHora { get; set; } = DateTime.Now;

        // --- AGREGADO PARA AUDITORÍA ---
        [BsonElement("EsManual")]
        public bool EsManual { get; set; } = false;

        [BsonElement("Origen")] 
        public string Origen { get; set; } = "Hardware";

        [BsonElement("FrecuenciaMinutos")]
        public int FrecuenciaMinutos { get; set; } = 0; 
    }
}