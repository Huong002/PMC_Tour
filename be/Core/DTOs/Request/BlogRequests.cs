using Core.Enums;

namespace Core.DTOs.Request;

public class CreateBlogRequest
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Excerpt { get; set; }
    public string? Author { get; set; }
    public string? ImageUrl { get; set; }
    public string? Tags { get; set; }
    public BlogStatus Status { get; set; } = BlogStatus.Draft;
}

public class UpdateBlogRequest
{
    public string? Title { get; set; }
    public string? Slug { get; set; }
    public string? Content { get; set; }
    public string? Excerpt { get; set; }
    public string? Author { get; set; }
    public string? ImageUrl { get; set; }
    public string? Tags { get; set; }
    public BlogStatus? Status { get; set; }
}
