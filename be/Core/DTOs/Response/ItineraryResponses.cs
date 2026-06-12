namespace Core.DTOs.Response;

public class ItineraryResponse
{
    public int Id { get; set; }
    public int TourId { get; set; }
    public int DayNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Meals { get; set; }
    public string? Hotel { get; set; }
    public string? Activities { get; set; }
    public DateTime CreatedAt { get; set; }
}
