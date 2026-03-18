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
        
        // Identificador del dueño del grupo
        public string UsuarioId { get; set; } = null!; 

        public List<string> SensoresIds { get; set; } = new List<string>();
        
        public string Estado { get; set; } = "Activo";
    }
}