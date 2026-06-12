namespace Core.DTOs.Response;

public class CustomerResponse
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? Nationality { get; set; }
    public string? PassportNumber { get; set; }
    public string? IdCard { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int BookingCount { get; set; }
}
