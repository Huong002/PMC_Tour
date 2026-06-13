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
                .ThenInclude(c => c.User)
            .Include(b => b.Tour)
                .ThenInclude(t => t.Images)
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

        // BR-05: Việc đăng ký tour phải thực hiện trước thời gian khởi hành theo quy định (ít nhất trước 2 ngày)
        if (request.StartDate.Date < DateTime.UtcNow.Date.AddDays(2))
            return ApiResponse<BookingResponse>.Fail("Việc đăng ký tour phải thực hiện trước thời gian khởi hành ít nhất 2 ngày theo quy định.", 400);

        // Kiểm tra xem Tour có đang mở đăng ký (Active) không
        if (tour.Status != TourStatus.Active)
            return ApiResponse<BookingResponse>.Fail("Tour này hiện không ở trạng thái mở đăng ký.", 400);

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

        // BR-02: Khi khách hàng gửi yêu cầu đăng ký tour, trạng thái tour chuyển sang chờ xác nhận, yêu cầu đăng ký chuyển sang chờ duyệt.
        tour.Status = TourStatus.Pending;

        await _unitOfWork.Bookings.AddAsync(booking);
        await _unitOfWork.Tours.UpdateAsync(tour);
        await _unitOfWork.SaveChangesAsync();

        var result = await GetByIdAsync(booking.Id);
        return ApiResponse<BookingResponse>.Ok(result.Data!, "Booking created successfully");
    }

    public async Task<ApiResponse<BookingResponse>> UpdateStatusAsync(int id, BookingStatus status, int userId)
    {
        var booking = await _unitOfWork.Bookings.GetQueryable()
            .Include(b => b.Tour)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
            return ApiResponse<BookingResponse>.Fail("Booking not found", 404);

        var tour = booking.Tour;
        string messageSuffix = "";

        // BR-03: Khi nhân viên phê duyệt yêu cầu, trạng thái tour/đăng ký chuyển sang đã xác nhận.
        if (status == BookingStatus.Confirmed)
        {
            booking.Status = BookingStatus.Confirmed;
            if (tour != null)
            {
                tour.Status = TourStatus.Confirmed;
                await _unitOfWork.Tours.UpdateAsync(tour);
            }
        }
        // Tour bắt đầu khởi hành (InProgress) - nhân viên xác nhận đã lên đường
        else if (status == BookingStatus.InProgress)
        {
            booking.Status = BookingStatus.InProgress;
            // Tour giữ trạng thái Confirmed khi đang diễn ra
        }
        // BR-04: Nếu yêu cầu bị từ chối/hủy, trạng thái quay về mở đăng ký và yêu cầu chuyển sang Cancelled.
        else if (status == BookingStatus.Cancelled)
        {
            booking.Status = BookingStatus.Cancelled;
            if (tour != null)
            {
                tour.Status = TourStatus.Active; // Quay về mở đăng ký
                await _unitOfWork.Tours.UpdateAsync(tour);
            }

            // BR-06: Nếu khách hủy tour trễ hạn thì phải chịu phí theo quy định (trong vòng 3 ngày trước khởi hành)
            var daysToStart = (booking.StartDate.Date - DateTime.UtcNow.Date).Days;
            if (daysToStart < 3 && daysToStart >= 0)
            {
                // Khách chịu phí 10% tổng giá trị tour do hủy trễ hạn
                var penalty = booking.TotalPrice * 0.1m;
                booking.FinalPrice = penalty;
                messageSuffix = $" (Áp dụng phí phạt hủy trễ hạn: {penalty.ToString("N0")}đ [10% tổng tiền])";
            }
            else
            {
                booking.FinalPrice = 0; // Hủy đúng hạn không mất phí
            }
        }
        // Tour hoàn thành (nhân viên đánh dấu sau khi kết thúc)
        else if (status == BookingStatus.Completed)
        {
            booking.Status = BookingStatus.Completed;
            if (tour != null)
            {
                tour.Status = TourStatus.Inactive; // Đóng tour sau khi hoàn thành
                await _unitOfWork.Tours.UpdateAsync(tour);
            }
        }
        // BR-07: Hoàn tiền cho khách sau khi hủy (Refunded)
        else if (status == BookingStatus.Refunded)
        {
            if (booking.Status != BookingStatus.Cancelled)
                return ApiResponse<BookingResponse>.Fail("Chỉ có thể hoàn tiền cho các đơn đã bị hủy.", 400);

            booking.Status = BookingStatus.Refunded;
            booking.FinalPrice = 0; // Đã hoàn tiền xong
            messageSuffix = " (Đã xử lý hoàn tiền theo chính sách BR-07)";
        }
        else
        {
            booking.Status = status;
        }

        booking.UpdatedBy = userId;
        booking.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Bookings.UpdateAsync(booking);
        await _unitOfWork.SaveChangesAsync();

        var result = await GetByIdAsync(booking.Id);
        return ApiResponse<BookingResponse>.Ok(result.Data!, $"Booking status updated{messageSuffix}");
    }

    private static string GenerateBookingCode()
    {
        return $"BK{DateTime.UtcNow:yyyyMMdd}{Random.Shared.Next(10000, 99999)}";
    }
}
