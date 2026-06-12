namespace Core.DTOs.Request;

public class CreateUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public List<int>? RoleIds { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateUserRequest
{
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public List<int>? RoleIds { get; set; }
    public bool? IsActive { get; set; }
}
