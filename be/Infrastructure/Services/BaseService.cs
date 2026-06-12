using Microsoft.AspNetCore.Http;

namespace Infrastructure.Services;

public abstract class BaseService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    protected BaseService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    /// <summary>
    /// Lấy userId từ token (claim "userId").
    /// </summary>
    protected int? UserId
    {
        get
        {
            var userId = _httpContextAccessor.HttpContext?.Items["UserId"]?.ToString();
            if (userId == null)
            {
                return null;
            }
            return int.Parse(userId);
        }
    }
}