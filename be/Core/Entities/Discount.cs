using Core.Enums;
using Shared;

namespace Core.Entities;

public class Discount : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal? MinOrderValue { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public int? UsageLimit { get; set; }
    public int UsedCount { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Booking> Bookings { get; set; } = [];
}
