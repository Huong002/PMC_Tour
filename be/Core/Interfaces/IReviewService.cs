using Core.DTOs.Request;
using Core.DTOs.Response;
using Shared;

namespace Core.Interfaces;

public interface IReviewService
{
    Task<ApiResponse<List<ReviewResponse>>> GetByTourIdAsync(int tourId);
    Task<ApiResponse<ReviewResponse>> CreateAsync(CreateReviewRequest request);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}
