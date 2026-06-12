using Core.Enums;
using Shared;

namespace Core.Entities;

public class User : BaseAuditableEntity
{
    public string UserName { get; set; }
    public byte[] PasswordSalt { get; set; }
    public byte[] PasswordHash { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public bool IsVerified { get; set; }
    public EUserType Type { get; set; }
    public List<RefreshToken> RefreshTokens { get; set; }
}