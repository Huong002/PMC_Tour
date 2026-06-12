using Core.DTOs.Response;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Infrastructure.Services;

public class ReportService : IReportService
{
    private readonly IUnitOfWork _unitOfWork;

    public ReportService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<RevenueReportResponse>> GetRevenueReportAsync(DateTime? fromDate, DateTime? toDate)
    {
        var from = fromDate ?? DateTime.UtcNow.AddMonths(-1);
        var to = toDate ?? DateTime.UtcNow;

        var payments = _unitOfWork.Repository<Payment>().GetQueryable()
            .Include(p => p.Booking)
            .Where(p => p.CreatedAt >= from && p.CreatedAt <= to)
            .ToList(); // EF SQLite/Postgres async for aggregate

        var totalRevenue = payments
            .Where(p => p.Booking.Status == BookingStatus.Confirmed)
            .Sum(p => p.Amount);

        var report = new RevenueReportResponse
        {
            FromDate = from,
            ToDate = to,
            TotalRevenue = totalRevenue,
            TotalPayments = payments.Count,
            SuccessfulPayments = payments.Count(p => p.Booking.Status == BookingStatus.Confirmed)
        };

        return ApiResponse<RevenueReportResponse>.Ok(report);
    }

    public async Task<ApiResponse<List<TourReportResponse>>> GetTourReportAsync(DateTime? fromDate, DateTime? toDate)
    {
        var tours = await _unitOfWork.Tours.GetQueryable()
            .Include(t => t.Bookings)
            .Where(t => t.IsActive)
            .Select(t => new TourReportResponse
            {
                TourId = t.Id,
                TourName = t.Name,
                TotalBookings = t.Bookings.Count,
                AverageRating = t.Reviews.Any() ? t.Reviews.Average(r => (double?)r.Rating) ?? 0 : 0
            })
            .OrderByDescending(t => t.TotalBookings)
            .ToListAsync();

        return ApiResponse<List<TourReportResponse>>.Ok(tours);
    }

    public async Task<ApiResponse<BookingReportResponse>> GetBookingReportAsync(DateTime? fromDate, DateTime? toDate)
    {
        var from = fromDate ?? DateTime.UtcNow.AddMonths(-1);
        var to = toDate ?? DateTime.UtcNow;

        var bookings = await _unitOfWork.Bookings.GetQueryable()
            .Where(b => b.CreatedAt >= from && b.CreatedAt <= to)
            .ToListAsync();

        var report = new BookingReportResponse
        {
            FromDate = from,
            ToDate = to,
            Total = bookings.Count,
            Pending = bookings.Count(b => b.Status == BookingStatus.Pending),
            Confirmed = bookings.Count(b => b.Status == BookingStatus.Confirmed),
            Completed = bookings.Count(b => b.Status == BookingStatus.Completed),
            Cancelled = bookings.Count(b => b.Status == BookingStatus.Cancelled)
        };

        return ApiResponse<BookingReportResponse>.Ok(report);
    }
}
