using Core.Enums;

namespace Core.DTOs.Request;

public class CreateReviewRequest
{
    public int TourId { get; set; }
    public int CustomerId { get; set; }
    public int? BookingId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
}

public class UpdateReviewStatusRequest
{
    public ReviewStatus Status { get; set; }
}
