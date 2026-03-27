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

        public MongoService(IOptions<MongoDbSettings> mongoDbSettings)
        {
            var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);

            // CAMBIO AQUÍ: Debe coincidir exactamente con Atlas (image_ca3b40.png)
            _usersCollection = mongoDatabase.GetCollection<User>("Users"); 
            _sensorsCollection = mongoDatabase.GetCollection<Sensor>("Sensores");
            _gruposCollection = mongoDatabase.GetCollection<Grupo>("Grupos");
        }

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

        // --- MÉTODOS DE CONTEO PARA ADMIN ---
        public async Task<long> CountGruposByUsuarioAsync(string userId) =>
            await _gruposCollection.CountDocumentsAsync(Builders<Grupo>.Filter.Eq("UsuarioId", userId));

        public async Task<long> CountSensoresByUsuarioAsync(string userId) =>
            await _sensorsCollection.CountDocumentsAsync(Builders<Sensor>.Filter.Eq("UsuarioId", userId));
    }
}