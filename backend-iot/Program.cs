using backend_iot.Services;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
// Agregamos esta línea para que reconozca el servicio si está en la raíz o en su carpeta
using backend_iot; 

var builder = WebApplication.CreateBuilder(args);

// --- 1. CONFIGURACIÓN DE SERVICIOS ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configuración de Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EcoMonitor API", Version = "v1" });
});

// --- 2. CONFIGURACIÓN DE MONGODB ---
var mongoSettings = builder.Configuration.GetSection("MongoDbSettings");

builder.Services.AddSingleton<IMongoClient>(sp => 
    new MongoClient(mongoSettings["ConnectionString"]));

builder.Services.AddScoped(sp => {
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoSettings["DatabaseName"]);
});

// --- 3. INYECCIÓN DE DEPENDENCIAS ---
builder.Services.AddScoped<IAuthService, AuthService>();

// AGREGA ESTA LÍNEA AQUÍ:
// Esto registra el servicio que creamos y quita los errores de los controladores
builder.Services.AddScoped<MongoService>(); 

// --- 4. CONFIGURACIÓN DE CORS (Para que Angular pueda entrar) ---
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngular", policy => {
        policy.WithOrigins("http://localhost:4200") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// --- 5. CONFIGURACIÓN DEL PIPELINE ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngular");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();