using AutoMapper;
using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Infrastructure.Services;

public class BookingService : IBookingService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public BookingService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedResult<BookingResponse>>> GetAllAsync(BookingFilterRequest filter)
    {
        var query = _unitOfWork.Bookings.GetQueryable()
            .Include(b => b.Customer)
            .Include(b => b.Tour)
            .AsQueryable();

        if (!string.IsNullOrEmpty(filter.BookingCode))
            query = query.Where(b => b.BookingCode!.Contains(filter.BookingCode));
        if (filter.CustomerId.HasValue)
            query = query.Where(b => b.CustomerId == filter.CustomerId.Value);
        if (filter.TourId.HasValue)
            query = query.Where(b => b.TourId == filter.TourId.Value);
        if (filter.Status.HasValue)
            query = query.Where(b => b.Status == filter.Status.Value);
        if (filter.StartDate.HasValue)
            query = query.Where(b => b.StartDate >= filter.StartDate.Value);
        if (filter.EndDate.HasValue)
            query = query.Where(b => b.StartDate <= filter.EndDate.Value);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(b => b.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        var data = _mapper.Map<List<BookingResponse>>(items);
        return ApiResponse<PagedResult<BookingResponse>>.Ok(
            new PagedResult<BookingResponse>(data, total, filter.Page, filter.PageSize));
    }

    public async Task<ApiResponse<PagedResult<BookingResponse>>> GetMyBookingsAsync(int userId, int page, int pageSize)
    {
        var customer = await _unitOfWork.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
        if (customer == null)
            return ApiResponse<PagedResult<BookingResponse>>.Ok(new PagedResult<BookingResponse>());

        var query = _unitOfWork.Bookings.GetQueryable()
            .Include(b => b.Customer)
            .Include(b => b.Tour)
            .Where(b => b.CustomerId == customer.Id);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(b => b.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var data = _mapper.Map<List<BookingResponse>>(items);
        return ApiResponse<PagedResult<BookingResponse>>.Ok(
            new PagedResult<BookingResponse>(data, total, page, pageSize));
    }

    public async Task<ApiResponse<BookingResponse>> GetByIdAsync(int id)
    {
        var booking = await _unitOfWork.Bookings.GetQueryable()
            .Include(b => b.Customer)
            .Include(b => b.Tour)
            .Include(b => b.BookingDetails)
            .Include(b => b.Payments)
            .Include(b => b.Discount)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
            return ApiResponse<BookingResponse>.Fail("Booking not found", 404);

        return ApiResponse<BookingResponse>.Ok(_mapper.Map<BookingResponse>(booking));
    }

    public async Task<ApiResponse<BookingResponse>> CreateAsync(CreateBookingRequest request, int userId)
    {
        var tour = await _unitOfWork.Tours.GetByIdAsync(request.TourId);
        if (tour == null)
            return ApiResponse<BookingResponse>.Fail("Tour not found", 404);

        var customer = await _unitOfWork.Customers.GetByIdAsync(request.CustomerId);
        if (customer == null)
            return ApiResponse<BookingResponse>.Fail("Customer not found", 404);

        var booking = _mapper.Map<Booking>(request);
        booking.BookingCode = GenerateBookingCode();
        booking.TotalPrice = (request.NumAdults * tour.PriceAdult) + (request.NumChildren * tour.PriceChild);
        booking.FinalPrice = booking.TotalPrice;
        booking.Status = BookingStatus.Pending;
        booking.CreatedBy = userId;
        booking.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.Bookings.AddAsync(booking);
        await _unitOfWork.SaveChangesAsync();

        var result = await GetByIdAsync(booking.Id);
        return ApiResponse<BookingResponse>.Ok(result.Data!, "Booking created successfully");
    }

    public async Task<ApiResponse<BookingResponse>> UpdateStatusAsync(int id, BookingStatus status, int userId)
    {
        var booking = await _unitOfWork.Bookings.GetByIdAsync(id);
        if (booking == null)
            return ApiResponse<BookingResponse>.Fail("Booking not found", 404);

        booking.Status = status;
        booking.UpdatedBy = userId;
        booking.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Bookings.UpdateAsync(booking);
        await _unitOfWork.SaveChangesAsync();

        var result = await GetByIdAsync(booking.Id);
        return ApiResponse<BookingResponse>.Ok(result.Data!, "Booking status updated");
    }

    private static string GenerateBookingCode()
    {
        return $"BK{DateTime.UtcNow:yyyyMMdd}{Random.Shared.Next(10000, 99999)}";
    }
}
