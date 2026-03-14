using backend_iot.Services;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;

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
// Asegúrate de que en appsettings.json existan "ConnectionString" y "DatabaseName"
var mongoSettings = builder.Configuration.GetSection("MongoDbSettings");

builder.Services.AddSingleton<IMongoClient>(sp => 
    new MongoClient(mongoSettings["ConnectionString"]));

builder.Services.AddScoped(sp => {
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoSettings["DatabaseName"]);
});

// --- 3. INYECCIÓN DE DEPENDENCIAS ---
builder.Services.AddScoped<IAuthService, AuthService>();

// --- 4. CONFIGURACIÓN DE CORS (Para que Angular pueda entrar) ---
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngular", policy => {
        policy.WithOrigins("http://localhost:4200") // Puerto por defecto de Angular
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// --- 5. CONFIGURACIÓN DEL PIPELINE (EL ORDEN IMPORTA MUCHO) ---

// Swagger siempre al principio en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 1. CORS debe ir ANTES de cualquier mapeo o autorización
app.UseCors("AllowAngular");

// 2. Redirección y archivos estáticos
app.UseHttpsRedirection();

// 3. Autorización (aunque aún no usemos JWT, debe estar aquí)
app.UseAuthorization();

// 4. Mapeo de Controladores
app.MapControllers();

app.Run();