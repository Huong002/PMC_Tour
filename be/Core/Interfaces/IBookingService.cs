using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Enums;
using Shared;

namespace Core.Interfaces;

public interface IBookingService
{
    Task<ApiResponse<PagedResult<BookingResponse>>> GetAllAsync(BookingFilterRequest filter);
    Task<ApiResponse<PagedResult<BookingResponse>>> GetMyBookingsAsync(int userId, int page, int pageSize);
    Task<ApiResponse<BookingResponse>> GetByIdAsync(int id);
    Task<ApiResponse<BookingResponse>> CreateAsync(CreateBookingRequest request, int userId);
    Task<ApiResponse<BookingResponse>> UpdateStatusAsync(int id, BookingStatus status, int userId);
}
