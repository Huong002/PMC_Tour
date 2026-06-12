using Core.Enums;

namespace Core.DTOs.Request;

public class CreateCustomerRequest
{
    public int? UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }
    public string? Nationality { get; set; }
    public string? PassportNumber { get; set; }
    public string? IdCard { get; set; }
}

public class UpdateCustomerRequest
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }
    public string? Nationality { get; set; }
    public string? PassportNumber { get; set; }
    public string? IdCard { get; set; }
    public bool? IsActive { get; set; }
}
