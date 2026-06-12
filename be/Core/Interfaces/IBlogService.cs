using Core.DTOs.Request;
using Core.DTOs.Response;
using Shared;

namespace Core.Interfaces;

public interface IBlogService
{
    Task<ApiResponse<PagedResult<BlogResponse>>> GetAllAsync(PagedRequest request);
    Task<ApiResponse<BlogResponse>> GetByIdAsync(int id);
    Task<ApiResponse<BlogResponse>> GetBySlugAsync(string slug);
    Task<ApiResponse<BlogResponse>> CreateAsync(CreateBlogRequest request);
    Task<ApiResponse<BlogResponse>> UpdateAsync(int id, UpdateBlogRequest request);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}
