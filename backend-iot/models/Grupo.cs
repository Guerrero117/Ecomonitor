using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace backend_iot.Models
{
    public class Grupo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Nombre { get; set; } = null!;
        
        // Cambio clave: '?' permite que Angular no lo envíe y el servidor lo asigne después
        public string? UsuarioId { get; set; } 

        public List<string> SensoresIds { get; set; } = new List<string>();
        
        public string Estado { get; set; } = "Activo";
    }
}