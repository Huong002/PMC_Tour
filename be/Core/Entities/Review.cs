using Core.Enums;
using Shared;

namespace Core.Entities;

public class Review : BaseEntity
{
    public int TourId { get; set; }
    public int CustomerId { get; set; }
    public int? BookingId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
    public bool IsActive { get; set; } = true;

    public Tour Tour { get; set; } = null!;
    public Customer Customer { get; set; } = null!;
    public Booking? Booking { get; set; }
}
