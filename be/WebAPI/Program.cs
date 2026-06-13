using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Npgsql;
using Core.Extensions;
using Infrastructure.Data;
using Infrastructure.Extensions;
using WebAPI.Middleware;

var builder = WebApplication.CreateBuilder(args);

// ===== Layers =====
builder.Services.AddCoreLayer();
builder.Services.AddInfrastructureLayer(builder.Configuration);

// ===== JWT Authentication =====
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// ===== Controllers =====
builder.Services.AddControllers();

// ===== Swagger =====
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "PMC Tour API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Nhập 'Bearer' [khoảng trắng] rồi đến token của bạn.\r\n\r\nVí dụ: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            Array.Empty<string>()
        }
    });
});

// ===== CORS =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    var connStr = config.GetConnectionString("DefaultConnection")!;
    var cb = new NpgsqlConnectionStringBuilder(connStr);
    var targetDb = cb.Database!;

    cb.Database = "postgres";
    using var masterConn = new NpgsqlConnection(cb.ConnectionString);
    await masterConn.OpenAsync();

    using var checkCmd = new NpgsqlCommand(
        "SELECT 1 FROM pg_database WHERE datname = @name", masterConn);
    checkCmd.Parameters.AddWithValue("name", targetDb);
    var exists = await checkCmd.ExecuteScalarAsync();

    if (exists == null)
    {
        using var createCmd = new NpgsqlCommand(
            $"CREATE DATABASE \"{targetDb}\"", masterConn);
        await createCmd.ExecuteNonQueryAsync();
    }

    await masterConn.CloseAsync();

    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.EnsureCreatedAsync();

    // Override all seed user passwords to "123456" (dev only)
    var allUsers = await db.Users.ToListAsync();
    if (allUsers.Any())
    {
        var hash = BCrypt.Net.BCrypt.HashPassword("123456");
        foreach (var u in allUsers) u.PasswordHash = hash;
        await db.SaveChangesAsync();
    }

    // Ensure Customer.UserId column exists (for old databases)
    await db.Database.ExecuteSqlRawAsync(
        "ALTER TABLE \"Customers\" ADD COLUMN IF NOT EXISTS \"UserId\" integer NULL");
    await db.Database.ExecuteSqlRawAsync(
        "CREATE INDEX IF NOT EXISTS IX_Customers_UserId ON \"Customers\" (\"UserId\")");
    // NOTE: Không tự gán UserId = Id vì Customer.Id ≠ User.Id (sẽ vi phạm FK)
    // UserId được set đúng khi user đăng ký qua API

    // Ensure Itinerary.Timeline column exists (for timeline feature)
    await db.Database.ExecuteSqlRawAsync(
        "ALTER TABLE \"Itineraries\" ADD COLUMN IF NOT EXISTS \"Timeline\" text NULL");

    // Ensure Tour.Status column exists (for tour status feature)
    await db.Database.ExecuteSqlRawAsync(
        "ALTER TABLE \"Tours\" ADD COLUMN IF NOT EXISTS \"Status\" integer NOT NULL DEFAULT 0");
}

// ===== Middleware Pipeline =====
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "PMC Tour API v1");
    c.RoutePrefix = string.Empty; // Hiển thị Swagger trực tiếp tại URL gốc http://localhost:5189
});

app.UseCors("AllowAll");

app.UseJwtMiddleware();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
