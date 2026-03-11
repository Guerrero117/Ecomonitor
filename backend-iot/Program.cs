using backend_iot.Services;
using Microsoft.OpenApi.Models;
using MongoDB.Driver; // <--- Importante añadir esto

var builder = WebApplication.CreateBuilder(args);

// --- 1. Agregar Servicios ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EcoMonitor API", Version = "v1" });
});

// --- NUEVO: Configuración de MongoDB ---
// Leemos la sección del archivo appsettings.json
var mongoSettings = builder.Configuration.GetSection("MongoDbSettings");

// Registramos el cliente de conexión
builder.Services.AddSingleton<IMongoClient>(sp => 
    new MongoClient(mongoSettings["ConnectionString"]));

// Registramos la base de datos para que los controladores la usen
builder.Services.AddScoped(sp => {
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoSettings["DatabaseName"]);
});

// --- 2. Inyectar nuestro servicio de Auth ---
builder.Services.AddScoped<IAuthService, AuthService>();

// --- 3. Configurar CORS para Angular ---
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngular", policy => {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// --- 4. Configurar el Pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();

app.Run();