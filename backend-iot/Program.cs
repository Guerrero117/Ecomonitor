using backend_iot.Services;
using backend_iot.Models;
using backend_iot; 
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Options;
// IMPORTANTE: Asegúrate de tener instalada la librería de Rate Limiting (nativa en .NET 7/8+)
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CONFIGURACIÓN DE SEGURIDAD (JWT) ---
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey) || jwtKey.Length < 32) {
    throw new Exception("Seguridad Crítica: La JWT_KEY no está configurada o es muy corta.");
}
var key = Encoding.ASCII.GetBytes(jwtKey); 

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false; 
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false, 
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero 
    };
});

// --- NUEVO: CONFIGURACIÓN DE RATE LIMITING (OWASP A04:2021) ---
builder.Services.AddRateLimiter(options =>
{
    // Definimos la política para el Login
    options.AddFixedWindowLimiter(policyName: "LoginPolicy", fixedOptions =>
    {
        fixedOptions.PermitLimit = 15;            // Máximo 15 peticiones
        fixedOptions.Window = TimeSpan.FromSeconds(30); // En un lapso de 30 segundos
        fixedOptions.QueueLimit = 0;             // Rechazo inmediato si se pasa del límite
    });

    // Respuesta personalizada cuando el usuario es bloqueado (Error 429)
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsync("Demasiadas peticiones. Bloqueo temporal por seguridad (30s).", token);
    };
});

builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EcoMonitor API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
        In = ParameterLocation.Header,
        Description = "Insertar JWT: Bearer {token}",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey 
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, new string[] { } }
    });
});

// --- 2. MONGODB ---
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
var mongoSettings = builder.Configuration.GetSection("MongoDbSettings");
builder.Services.AddSingleton<IMongoClient>(sp => new MongoClient(mongoSettings["ConnectionString"]));
builder.Services.AddScoped<IMongoDatabase>(sp => {
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoSettings["DatabaseName"]);
});

builder.Services.AddSingleton<MongoService>(); 
builder.Services.AddScoped<IAuthService, AuthService>(); 

// --- 3. CORS DINÁMICO ---
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.SetIsOriginAllowed(origin => 
        {
            var host = new Uri(origin).Host;
            return host == "localhost" || host.StartsWith("192.168.");
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials(); 
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

// --- ORDEN DE MIDDLEWARES ---
app.UseCors("AllowAll");

// Activar el Rate Limiter antes de la autenticación para ahorrar recursos
app.UseRateLimiter(); 

app.UseAuthentication(); 
app.UseAuthorization();
app.MapControllers();

app.Run();