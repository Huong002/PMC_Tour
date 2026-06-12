using Core.DTOs.Response;
using Shared;

namespace Core.Interfaces;

public interface ITourTypeService
{
    Task<ApiResponse<List<TourTypeResponse>>> GetAllAsync();
    Task<ApiResponse<TourTypeResponse>> GetByIdAsync(int id);
}
