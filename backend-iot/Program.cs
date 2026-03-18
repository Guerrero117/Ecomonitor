using backend_iot.Services;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using backend_iot; 
using System.Text.Json; // Importante para la configuración de JSON

var builder = WebApplication.CreateBuilder(args);

// --- 1. CONFIGURACIÓN DE SERVICIOS ---
// CORRECCIÓN: Agregamos AddJsonOptions para que Angular entienda las propiedades (nombre, tipo, etc.)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

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