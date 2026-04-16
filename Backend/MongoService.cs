using backend_iot.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend_iot
{
    public class MongoService
    {
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<Sensor> _sensorsCollection;
        private readonly IMongoCollection<Grupo> _gruposCollection;
        private readonly IMongoCollection<Log> _logsCollection; 

        public MongoService(IOptions<MongoDbSettings> mongoDbSettings)
        {
            var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);

            _usersCollection = mongoDatabase.GetCollection<User>("Users"); 
            _sensorsCollection = mongoDatabase.GetCollection<Sensor>("Sensores");
            _gruposCollection = mongoDatabase.GetCollection<Grupo>("Grupos");
            _logsCollection = mongoDatabase.GetCollection<Log>("Logs"); 
        }

        // --- MÉTODOS DE LOGS ---
        public async Task RegistrarLogAsync(string? userId, string accion, string detalle, string? ip = null)
        {
            var nuevoLog = new Log
            {
                UsuarioId = userId ?? "ANONIMO",
                Accion = accion,
                Detalle = detalle,
                Ip = ip,
                Fecha = DateTime.UtcNow
            };
            await _logsCollection.InsertOneAsync(nuevoLog);
        }

        public async Task<List<Log>> GetLogsRecientesAsync() =>
            await _logsCollection.Find(_ => true).SortByDescending(x => x.Fecha).Limit(100).ToListAsync();

        // --- MÉTODOS DE USUARIOS ---
        public async Task<List<User>> GetAllUsersAsync() =>
            await _usersCollection.Find(_ => true).ToListAsync();

        public async Task<User?> GetUserByEmailAsync(string email) =>
            await _usersCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

        public async Task CreateUserAsync(User newUser) =>
            await _usersCollection.InsertOneAsync(newUser);

        // --- MÉTODOS DE SENSORES ---
        public async Task<List<Sensor>> GetSensorsPorUsuarioAsync(string userId) =>
            await _sensorsCollection.Find(x => x.UsuarioId == userId).ToListAsync();

        public async Task<Sensor?> GetSensorByIdAsync(string id) =>
            await _sensorsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateSensorAsync(Sensor nuevoSensor) =>
            await _sensorsCollection.InsertOneAsync(nuevoSensor);

        public async Task DeleteSensorAsync(string id) =>
            await _sensorsCollection.DeleteOneAsync(x => x.Id == id);

        // --- MÉTODOS DE GRUPOS ---
        public async Task<List<Grupo>> GetGruposPorUsuarioAsync(string userId) =>
            await _gruposCollection.Find(x => x.UsuarioId == userId).ToListAsync();

        public async Task CreateGrupoAsync(Grupo nuevoGrupo) =>
            await _gruposCollection.InsertOneAsync(nuevoGrupo);

        // NUEVO: Método para obtener un grupo específico por su ID
        public async Task<Grupo?> GetGrupoByIdAsync(string id) =>
            await _gruposCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        // --- MÉTODOS DE CONTEO ---
        public async Task<long> CountGruposByUsuarioAsync(string userId) =>
            await _gruposCollection.CountDocumentsAsync(Builders<Grupo>.Filter.Eq("UsuarioId", userId));

        public async Task<long> CountSensoresByUsuarioAsync(string userId) =>
            await _sensorsCollection.CountDocumentsAsync(Builders<Sensor>.Filter.Eq("UsuarioId", userId));
    }
}