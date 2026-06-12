using Core.Entities;

namespace Core.Interfaces;

public interface IJwtUtils
{
    public string GenerateJwtToken(User user);
    public int? ValidateJwtToken(string token);
    public RefreshToken GenerateRefreshToken(User user, string ipAddress);
}