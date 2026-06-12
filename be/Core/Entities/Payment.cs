using Core.Enums;
using Shared;

namespace Core.Entities;

public class Payment : BaseEntity
{
    public int BookingId { get; set; }
    public string TransactionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Note { get; set; }
    public int CreatedBy { get; set; }

    public Booking Booking { get; set; } = null!;
    public User CreatedByUser { get; set; } = null!;
}
