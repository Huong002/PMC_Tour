using System.Reflection;
using Core.Interfaces;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Shared;
using Shared.Interfaces;

namespace Core.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddCoreLayer(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
    }
}