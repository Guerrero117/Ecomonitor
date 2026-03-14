using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic; // Necesario para List<>

namespace backend_iot.Models // <--- CAMBIADO: De EcoMonitor a backend_iot
{
    public class Grupo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Nombre { get; set; } = null!;
        
        public List<string> SensoresIds { get; set; } = new List<string>();
        
        public string Estado { get; set; } = "Activo";
    }
}