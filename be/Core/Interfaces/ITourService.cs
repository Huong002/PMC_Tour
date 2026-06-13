using Core.DTOs.Request;
using Core.DTOs.Response;
using Shared;

namespace Core.Interfaces;

public interface ITourService
{
    Task<ApiResponse<PagedResult<TourResponse>>> GetAllAsync(TourFilterRequest filter);
    Task<ApiResponse<TourResponse>> GetByIdAsync(int id);
    Task<ApiResponse<TourResponse>> GetBySlugAsync(string slug);
    Task<ApiResponse<TourResponse>> CreateAsync(CreateTourRequest request, int userId);
    Task<ApiResponse<TourResponse>> UpdateAsync(int id, UpdateTourRequest request, int userId);
    Task<ApiResponse<bool>> DeleteAsync(int id);
    Task<ApiResponse<TourResponse>> ToggleActiveAsync(int id, int userId);
}
