using MongoDB.Driver;
using backend_iot.Models;
using System.Collections.Generic; // Para que reconozca List<>
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
            // Así conectamos con tus colecciones de MongoDB
            _sensorsCollection = database.GetCollection<Sensor>("Sensores");
            _lecturasCollection = database.GetCollection<Lectura>("Lecturas");
            _gruposCollection = database.GetCollection<Grupo>("Grupos");
        }

        // Métodos para Grupos
        public async Task<List<Grupo>> GetGruposAsync() => await _gruposCollection.Find(_ => true).ToListAsync();
        public async Task CreateGrupoAsync(Grupo nuevoGrupo) => await _gruposCollection.InsertOneAsync(nuevoGrupo);
        public async Task<Grupo?> GetGrupoByIdAsync(string id) => await _gruposCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        // Métodos para Sensores y Lecturas
        public async Task<Sensor?> GetSensorByIdAsync(string id) => await _sensorsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        public async Task InsertLecturaAsync(Lectura lectura) => await _lecturasCollection.InsertOneAsync(lectura);
        public async Task<List<Lectura>> GetLecturasBySensorIdsAsync(List<string> ids) => 
            await _lecturasCollection.Find(l => ids.Contains(l.SensorId)).SortByDescending(l => l.FechaHora).Limit(50).ToListAsync();
    }
}