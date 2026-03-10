using backend_iot.Services;
using Microsoft.OpenApi.Models;

// Aquí es donde empieza a "cocinarse" la aplicación
var builder = WebApplication.CreateBuilder(args);

// --- 1. Agregar Servicios ---
// Le decimos a la compu que vamos a usar controladores (las rutas de la API)
builder.Services.AddControllers();

// Esto es para que la API sepa explicar qué hace
builder.Services.AddEndpointsApiExplorer();

// Aquí configuramos el SWAGGER (Esa página azul que usamos para probar)
// Es como ponerle un letrero de "Bienvenida" y título a nuestra página de pruebas
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EcoMonitor API", Version = "v1" });
});

// --- 2. Inyectar nuestro servicio de Auth ---
// Esta parte es clave: le decimos al proyecto: "Oye, cuando alguien ocupe seguridad (IAuthService), 
// usa la lógica que escribimos en AuthService". Es como contratar al guardia de seguridad.
builder.Services.AddScoped<IAuthService, AuthService>();

// --- 3. Configurar CORS para Angular ---
// Esto es súper importante. Por seguridad, las APIs no dejan que cualquiera les hable.
// Aquí le estamos dando "pase VIP" a nuestro proyecto de Angular que corre en el puerto 4200.
// Sin esto, Angular y el Backend se llevarían mal y no se hablarían.
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngular", policy => {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Ya que terminamos de configurar, "armamos" la aplicación
var app = builder.Build();

// --- 4. Configurar el camino que siguen los datos (Pipeline) ---

// Si estamos todavía programando (Desarrollo), activa Swagger para poder testear
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ACTIVAMOS LOS PERMISOS:
app.UseCors("AllowAngular"); // Primero abrimos la puerta para Angular

app.UseAuthorization();      // Luego checamos que tengan permiso de entrar

app.MapControllers();        // Conectamos todas las rutas que creamos

// ¡Fuego! Aquí es donde el servidor se pone a escuchar peticiones
app.Run();