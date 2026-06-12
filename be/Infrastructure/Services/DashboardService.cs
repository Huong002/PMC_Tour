using Core.DTOs.Response;
using Core.Enums;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _unitOfWork;

    public DashboardService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<DashboardStatsResponse>> GetStatsAsync()
    {
        var totalTours = await _unitOfWork.Tours.CountAsync();
        var activeTours = await _unitOfWork.Tours.CountAsync(t => t.IsActive);
        var totalBookings = await _unitOfWork.Bookings.CountAsync();
        var pendingBookings = await _unitOfWork.Bookings.CountAsync(b => b.Status == BookingStatus.Pending);
        var confirmedBookings = await _unitOfWork.Bookings.CountAsync(b => b.Status == BookingStatus.Confirmed);
        var totalCustomers = await _unitOfWork.Customers.CountAsync();
        var totalReviews = await _unitOfWork.Reviews.CountAsync();

        var stats = new DashboardStatsResponse
        {
            TotalTours = totalTours,
            ActiveTours = activeTours,
            TotalBookings = totalBookings,
            PendingBookings = pendingBookings,
            ConfirmedBookings = confirmedBookings,
            TotalCustomers = totalCustomers,
            TotalReviews = totalReviews
        };

        return ApiResponse<DashboardStatsResponse>.Ok(stats);
    }
}
