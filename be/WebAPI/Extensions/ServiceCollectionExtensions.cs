using System.Reflection;
using Consul;
using Core.Interfaces;
using HealthChecks.UI.Client;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Infrastructure.Settings;
using MediatR;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Shared;
using Shared.Interfaces;
using WebAPI.Authorization;

namespace WebAPI.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddApplicationLayer(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHealthChecks();
        services
            .AddTransient(typeof(IUnitOfWork), typeof(UnitOfWork))
            .AddTransient(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services
            .AddTransient<IMediator, Mediator>()
            .AddTransient<IDomainEventDispatcher, DomainEventDispatcher>();
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString,
                builder => builder.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IJwtUtils, JwtUtils>();
        services.AddScoped<IReportService, ReportService>();
        
        services.Configure<AppSettings>(configuration.GetSection("AppSettings"));
        services.AddSingleton<IAppSettings>(sp => sp.GetRequiredService<IOptions<AppSettings>>().Value);
    }
    
    public static async Task ConfigsApp(this WebApplication app)
    {
        app.UseAuthentication();
        app.UseAuthorization();
        
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.MapHealthChecks(
            "/health",
            new HealthCheckOptions
            {
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });
        app.MapControllers();
        app.UseMiddleware<JwtMiddleware>();
        await ConfigsConsul(app);
    }

    private static async Task ConfigsConsul(WebApplication app)
    {
        if (!app.Environment.IsDevelopment())
        {
            var consulClient = new ConsulClient(config =>
            {
                config.Address = new Uri("http://172.20.75.222:8500");
            });

            var registration = new AgentServiceRegistration()
            {
                ID = "FaceIdService",
                Name = "FaceIdService",
                Address = "172.20.75.221",
                Port = 9980,
                Tags = new[] { "api", "FaceIdService" },
            };

            await consulClient.Agent.ServiceRegister(registration);
            app.Lifetime.ApplicationStopping.Register(async () =>
            {
                await consulClient.Agent.ServiceDeregister(registration.ID);
            }); 
        }
    }
}