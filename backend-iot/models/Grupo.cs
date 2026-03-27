using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend_iot.Models
{
    public class Grupo
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [Required]
        [StringLength(30)]
        public string Nombre { get; set; } = null!;
        
        public string? UsuarioId { get; set; } 

        public List<string> SensoresIds { get; set; } = new List<string>();
        
        public string Estado { get; set; } = "Activo";
    }
}