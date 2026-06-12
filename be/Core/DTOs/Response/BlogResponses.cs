namespace Core.DTOs.Response;

public class BlogResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? Author { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? Tags { get; set; }
    public bool IsActive { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class BlogSummaryResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? Author { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? Tags { get; set; }
    public bool IsActive { get; set; }
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
