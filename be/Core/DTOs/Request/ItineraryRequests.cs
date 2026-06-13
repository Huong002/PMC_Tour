namespace Core.DTOs.Request;

public class CreateItineraryRequest
{
    public int TourId { get; set; }
    public int DayNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Meals { get; set; }
    public string? Hotel { get; set; }
    public string? Activities { get; set; }
    public string? Timeline { get; set; }
}

public class UpdateItineraryRequest
{
    public int? DayNumber { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Meals { get; set; }
    public string? Hotel { get; set; }
    public string? Activities { get; set; }
    public string? Timeline { get; set; }
}
