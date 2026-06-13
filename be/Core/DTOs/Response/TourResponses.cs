namespace Core.DTOs.Response;

public class TourResponse
{
    public int Id { get; set; }
    public int TourTypeId { get; set; }
    public string TourTypeName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int DurationDays { get; set; }
    public int DurationNights { get; set; }
    public string Location { get; set; } = string.Empty;
    public decimal PriceAdult { get; set; }
    public decimal PriceChild { get; set; }
    public decimal PriceInfant { get; set; }
    public int MaxPeople { get; set; }
    public int RegisteredCount { get; set; }
    public decimal? SalePrice { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }
    public string? Description { get; set; }
    public string? Included { get; set; }
    public string? Excluded { get; set; }
    public string? Note { get; set; }
    public string? Transportation { get; set; }
    public string? Hotel { get; set; }
    public List<TourImageResponse> Images { get; set; } = new();
    public List<ItineraryResponse> Itineraries { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class TourSummaryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string TourTypeName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int DurationDays { get; set; }
    public decimal PriceAdult { get; set; }
    public decimal? SalePrice { get; set; }
    public bool IsActive { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TourImageResponse
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public int SortOrder { get; set; }
}
