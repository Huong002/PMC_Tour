using Shared;

namespace Core.Entities;

public class BlogCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
