using Core.Enums;

namespace Core.DTOs.Responses;

public class AuthenticationResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public AuthenticatedUserResponse User { get; set; }
}

public class AuthenticatedUserResponse
{
    public string UserName { get; set; }
    public string FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public EUserType Type { get; set; }
}