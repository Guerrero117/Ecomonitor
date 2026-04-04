using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace backend_iot.Models
{
    [BsonIgnoreExtraElements]
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("nombre")] 
        public string? Nombre { get; set; }

        [BsonElement("email")]
        public string? Email { get; set; }

        [BsonElement("rol")]
        public string? Rol { get; set; } = "user";

        [BsonElement("password")]
        public string? Password { get; set; }

        [BsonElement("fechaRegistro")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)] // Crucial para que Mongo y C# se entiendan
        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    }
}