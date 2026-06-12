using Shared;

namespace Core.Entities;

public class BookingDetail : BaseEntity
{
    public int BookingId { get; set; }
    public string? FullName { get; set; }
    public string? PassportNumber { get; set; }
    public string? Note { get; set; }

    public Booking Booking { get; set; } = null!;
}
