using Core.DTOs.Request;
using Core.DTOs.Response;
using Shared;

namespace Core.Interfaces;

public interface IDiscountService
{
    Task<ApiResponse<PagedResult<DiscountResponse>>> GetAllAsync(PagedRequest request);
    Task<ApiResponse<DiscountResponse>> GetByIdAsync(int id);
    Task<ApiResponse<DiscountResponse>> GetByCodeAsync(string code);
    Task<ApiResponse<DiscountResponse>> CreateAsync(CreateDiscountRequest request);
    Task<ApiResponse<DiscountResponse>> UpdateAsync(int id, UpdateDiscountRequest request);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}
