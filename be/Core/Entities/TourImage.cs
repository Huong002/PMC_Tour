using Shared;

namespace Core.Entities;

public class TourImage : BaseEntity
{
    public int TourId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public int SortOrder { get; set; }

    public Tour Tour { get; set; } = null!;
}
