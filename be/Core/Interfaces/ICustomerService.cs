using Core.DTOs.Request;
using Core.DTOs.Response;
using Shared;

namespace Core.Interfaces;

public interface ICustomerService
{
    Task<ApiResponse<PagedResult<CustomerResponse>>> GetAllAsync(PagedRequest request);
    Task<ApiResponse<CustomerResponse>> GetByIdAsync(int id);
    Task<ApiResponse<CustomerResponse>> CreateAsync(CreateCustomerRequest request);
    Task<ApiResponse<CustomerResponse>> UpdateAsync(int id, UpdateCustomerRequest request);
    Task<ApiResponse<bool>> DeleteAsync(int id, int currentUserId);
    Task<ApiResponse<CustomerResponse>> GetCurrentCustomerAsync(int userId);
}
