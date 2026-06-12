using Core.DTOs.Request;
using Core.DTOs.Response;
using Shared;

namespace Core.Interfaces;

public interface IItineraryService
{
    Task<ApiResponse<List<ItineraryResponse>>> GetByTourIdAsync(int tourId);
    Task<ApiResponse<ItineraryResponse>> CreateAsync(CreateItineraryRequest request);
    Task<ApiResponse<ItineraryResponse>> UpdateAsync(int id, UpdateItineraryRequest request);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}
