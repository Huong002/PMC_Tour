using Shared;

namespace Core.Entities;

public class TourType : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int SortOrder { get; set; }

    public ICollection<Tour> Tours { get; set; } = [];
}
