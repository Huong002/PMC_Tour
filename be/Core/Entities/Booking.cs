using Core.Enums;
using Shared;

namespace Core.Entities;

public class Booking : BaseEntity
{
    public string BookingCode { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public int TourId { get; set; }
    public DateTime BookingDate { get; set; } = DateTime.UtcNow;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int NumAdults { get; set; }
    public int NumChildren { get; set; }
    public decimal TotalPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal FinalPrice { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public string? Notes { get; set; }
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;
    public PaymentMethod? PaymentMethod { get; set; }
    public int? DiscountId { get; set; }
    public int CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }

    public Customer Customer { get; set; } = null!;
    public Tour Tour { get; set; } = null!;
    public Discount? Discount { get; set; }
    public ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public User CreatedByUser { get; set; } = null!;
    public User? UpdatedByUser { get; set; }
}
