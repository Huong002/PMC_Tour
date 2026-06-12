namespace Core.Interfaces;

public interface IAppSettings
{
    public string Secret { get; set; }

    public int RefreshTokenTTL { get; set; } 
}