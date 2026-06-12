using Core.Enums;
using Shared;

namespace Core.Entities;

public class Blog : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? Author { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? Tags { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? PublishedAt { get; set; }
}
