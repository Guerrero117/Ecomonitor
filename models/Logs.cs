using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend_iot.Models
{
    public class Log
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("usuarioId")]
        public string? UsuarioId { get; set; } // "Sistema" si no hay login

        [BsonElement("accion")]
        public string Accion { get; set; } = string.Empty; // Ejemplo: "LOGIN_SUCCESS", "LOGIN_FAILED", "ACCESO_ADMIN"

        [BsonElement("detalle")]
        public string Detalle { get; set; } = string.Empty;

        [BsonElement("ip")]
        public string? Ip { get; set; }

        [BsonElement("fecha")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
    }
}