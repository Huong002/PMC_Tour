using Core.Interfaces;

namespace Infrastructure.Settings;

public class AppSettings : IAppSettings
{
    public string Secret { get; set; }
    

    public int RefreshTokenTTL { get; set; }
}