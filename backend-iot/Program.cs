using System.Threading.RateLimiting;
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

var builder = WebApplication.CreateBuilder(args);

// --- 1. CONFIGURACIÓN DE SEGURIDAD (JWT) ---
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? builder.Configuration["Jwt:Key"] ?? "ClaveTemporalEcoMonitor2026_ParaPruebas";
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

// --- 2. CONFIGURACIÓN DE RATE LIMITING ---
;// --- NUEVO: CONFIGURACIÓN DE RATE LIMITING (Sintaxis Directa) ---
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Esta forma evita el error CS1061 porque no depende del método de extensión problemático
    options.AddPolicy("LoginPolicy", context => 
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString(),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 15,
                Window = TimeSpan.FromSeconds(30),
                QueueLimit = 0
            }));

    options.OnRejected = async (context, token) =>
    {
        await context.HttpContext.Response.WriteAsync("Demasiadas peticiones. Bloqueo temporal (30s).", token);
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

// --- 3. MONGODB ---
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
var mongoSettings = builder.Configuration.GetSection("MongoDbSettings");
builder.Services.AddSingleton<IMongoClient>(sp => new MongoClient(mongoSettings["ConnectionString"]));
builder.Services.AddScoped<IMongoDatabase>(sp => {
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoSettings["DatabaseName"]);
});

builder.Services.AddSingleton<MongoService>(); 
builder.Services.AddScoped<IAuthService, AuthService>(); 

// --- 4. CORS PARA HOSTING ---
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin() 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseRateLimiter(); // Importante que esté aquí
app.UseAuthentication(); 
app.UseAuthorization();
app.MapControllers();

app.Run();