using Core.DTOs.Request;
using Core.DTOs.Response;
using Shared;

namespace Core.Interfaces;

public interface IContactService
{
    Task<ApiResponse<ContactResponse>> CreateAsync(CreateContactRequest request);
    Task<ApiResponse<PagedResult<ContactResponse>>> GetAllAsync(PagedRequest request);
    Task<ApiResponse<ContactResponse>> GetByIdAsync(int id);
    Task<ApiResponse<bool>> DeleteAsync(int id);
}
