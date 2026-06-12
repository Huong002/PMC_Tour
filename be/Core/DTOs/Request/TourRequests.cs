using Core.Enums;

namespace Core.DTOs.Request;

public class CreateTourRequest
{
    public int TourTypeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public int DurationDays { get; set; }
    public int DurationNights { get; set; }
    public string Location { get; set; } = string.Empty;
    public decimal PriceAdult { get; set; }
    public decimal PriceChild { get; set; }
    public int MaxPeople { get; set; }
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public string? Highlights { get; set; }
    public string? Includes { get; set; }
    public string? Excludes { get; set; }
    public string? Itinerary { get; set; }
    public string? StartDates { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? ImageUrl { get; set; }
}

public class UpdateTourRequest
{
    public int? TourTypeId { get; set; }
    public string? Name { get; set; }
    public string? Slug { get; set; }
    public int? DurationDays { get; set; }
    public int? DurationNights { get; set; }
    public string? Location { get; set; }
    public decimal? PriceAdult { get; set; }
    public decimal? PriceChild { get; set; }
    public int? MaxPeople { get; set; }
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public string? Highlights { get; set; }
    public string? Includes { get; set; }
    public string? Excludes { get; set; }
    public string? Itinerary { get; set; }
    public string? StartDates { get; set; }
    public TourStatus? Status { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? ImageUrl { get; set; }
}

public class TourFilterRequest
{
    public string? SearchTerm { get; set; }
    public int? TourTypeId { get; set; }
    public decimal? PriceMin { get; set; }
    public decimal? PriceMax { get; set; }
    public int? DurationDays { get; set; }
    public string? Location { get; set; }
    public bool? IsActive { get; set; }
    public bool? IsFeatured { get; set; }
    public string? SortBy { get; set; }
    public bool? SortDesc { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class TourStatusRequest
{
    public TourStatus Status { get; set; }
}
