namespace Core.DTOs.Response;

public class DiscountResponse
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal? MinOrderValue { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public int? UsageLimit { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class DiscountValidationResponse
{
    public bool IsValid { get; set; }
    public string? Message { get; set; }
    public decimal? DiscountAmount { get; set; }
    public DiscountResponse? Discount { get; set; }
}
