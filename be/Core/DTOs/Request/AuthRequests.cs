namespace Core.DTOs.Request;

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
}

public class ChangePasswordRequest
{
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class UpdateProfileRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    
    // Thêm các trường mở rộng cho Customer
    public string? Address { get; set; }
    public System.DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; } // "Male", "Female", "Other"
    public string? Nationality { get; set; }
    public string? PassportNumber { get; set; }
    public string? IdCard { get; set; }
}
