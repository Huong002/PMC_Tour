using Core.Enums;

namespace Core.DTOs.Request;

public class CreateDiscountRequest
{
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal? MinOrderValue { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public int? UsageLimit { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

public class UpdateDiscountRequest
{
    public string? Code { get; set; }
    public string? Description { get; set; }
    public DiscountType? DiscountType { get; set; }
    public decimal? DiscountValue { get; set; }
    public decimal? MinOrderValue { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public int? UsageLimit { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool? IsActive { get; set; }
}

public class ValidateDiscountRequest
{
    public string Code { get; set; } = string.Empty;
    public decimal OrderValue { get; set; }
}
