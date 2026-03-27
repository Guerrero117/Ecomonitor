using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend_iot.Models
{
    [BsonIgnoreExtraElements]
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("nombre")] // <--- ESTO ES LA CLAVE: debe ser igual que en Atlas
        public string? Nombre { get; set; }

        [BsonElement("email")]
        public string? Email { get; set; }

        [BsonElement("rol")]
        public string? Rol { get; set; } = "user";

        [BsonElement("password")]
        public string? Password { get; set; }

        [BsonElement("fechaRegistro")]
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
    }
}