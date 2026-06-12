namespace Core.DTOs.Response;

public class ReviewResponse
{
    public int Id { get; set; }
    public int TourId { get; set; }
    public string TourName { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerAvatar { get; set; }
    public int? BookingId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
