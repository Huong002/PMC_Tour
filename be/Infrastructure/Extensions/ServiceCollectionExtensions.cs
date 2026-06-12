using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructureLayer(
        this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        // Unit of Work
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Generic Repository
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

        // Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITourService, TourService>();
        services.AddScoped<IBookingService, BookingService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IDiscountService, DiscountService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IBlogService, BlogService>();
        services.AddScoped<IItineraryService, ItineraryService>();
        services.AddScoped<ITourTypeService, TourTypeService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRoleService, RoleService>();

        return services;
    }
}
