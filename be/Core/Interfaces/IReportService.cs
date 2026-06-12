using Core.DTOs.Response;
using Shared;

namespace Core.Interfaces;

public interface IReportService
{
    Task<ApiResponse<RevenueReportResponse>> GetRevenueReportAsync(DateTime? fromDate, DateTime? toDate);
    Task<ApiResponse<List<TourReportResponse>>> GetTourReportAsync(DateTime? fromDate, DateTime? toDate);
    Task<ApiResponse<BookingReportResponse>> GetBookingReportAsync(DateTime? fromDate, DateTime? toDate);
}
