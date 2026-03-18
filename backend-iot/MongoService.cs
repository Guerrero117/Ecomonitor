using MongoDB.Driver;
using backend_iot.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend_iot
{
    public class MongoService
    {
        private readonly IMongoCollection<Sensor> _sensorsCollection;
        private readonly IMongoCollection<Lectura> _lecturasCollection;
        private readonly IMongoCollection<Grupo> _gruposCollection;

        public MongoService(IMongoDatabase database)
        {
            // Conexión con las colecciones de MongoDB Atlas
            // IMPORTANTE: Verifica que en Atlas la colección se llame "Sensores" (con S mayúscula)
            _sensorsCollection = database.GetCollection<Sensor>("Sensores");
            _lecturasCollection = database.GetCollection<Lectura>("Lecturas");
            _gruposCollection = database.GetCollection<Grupo>("Grupos");
        }

        // --- MÉTODOS PARA SENSORES (Los que faltaban) ---

        // Este es el método que Angular necesita para llenar la tabla
        public async Task<List<Sensor>> GetSensorsPorUsuarioAsync(string userId)
        {
            return await _sensorsCollection.Find(s => s.UsuarioId == userId).ToListAsync();
        }

        public async Task<List<Sensor>> GetSensorsAsync() => 
            await _sensorsCollection.Find(_ => true).ToListAsync();

        public async Task CreateSensorAsync(Sensor nuevoSensor) => 
            await _sensorsCollection.InsertOneAsync(nuevoSensor);

        public async Task DeleteSensorAsync(string id) => 
            await _sensorsCollection.DeleteOneAsync(x => x.Id == id);

        public async Task<Sensor?> GetSensorByIdAsync(string id) => 
            await _sensorsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();


        // --- MÉTODOS PARA GRUPOS ---

        public async Task<List<Grupo>> GetGruposPorUsuarioAsync(string userId)
        {
            return await _gruposCollection.Find(g => g.UsuarioId == userId).ToListAsync();
        }

        public async Task<List<Grupo>> GetGruposAsync() => 
            await _gruposCollection.Find(_ => true).ToListAsync();

        public async Task CreateGrupoAsync(Grupo nuevoGrupo) => 
            await _gruposCollection.InsertOneAsync(nuevoGrupo);

        public async Task<Grupo?> GetGrupoByIdAsync(string id) => 
            await _gruposCollection.Find(x => x.Id == id).FirstOrDefaultAsync();


        // --- MÉTODOS PARA LECTURAS ---

        public async Task InsertLecturaAsync(Lectura lectura) => 
            await _lecturasCollection.InsertOneAsync(lectura);

        public async Task<List<Lectura>> GetLecturasBySensorIdsAsync(List<string> ids) => 
            await _lecturasCollection.Find(l => ids.Contains(l.SensorId))
                                     .SortByDescending(l => l.FechaHora)
                                     .Limit(50)
                                     .ToListAsync();
    }
}