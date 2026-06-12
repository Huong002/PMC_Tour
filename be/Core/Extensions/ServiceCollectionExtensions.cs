using System.Reflection;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Core.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCoreLayer(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        return services;
    }

    public static IServiceCollection AddCoreLayerWithMediatR(this IServiceCollection services)
    {
        services.AddCoreLayer();
        return services;
    }
}
