using AutoMapper;
using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Infrastructure.Services;

public class TourService : ITourService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TourService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedResult<TourResponse>>> GetAllAsync(TourFilterRequest filter)
    {
        var query = _unitOfWork.Tours.GetQueryable()
            .Include(t => t.TourType)
            .Include(t => t.Images)
            .Include(t => t.Bookings)
            .AsQueryable();

        if (filter.TourTypeId.HasValue)
            query = query.Where(t => t.TourTypeId == filter.TourTypeId.Value);
        if (!string.IsNullOrEmpty(filter.SearchTerm))
            query = query.Where(t => t.Name.Contains(filter.SearchTerm) || t.Location.Contains(filter.SearchTerm));
        if (filter.PriceMin.HasValue)
            query = query.Where(t => (t.SalePrice ?? t.PriceAdult) >= filter.PriceMin.Value);
        if (filter.PriceMax.HasValue)
            query = query.Where(t => (t.SalePrice ?? t.PriceAdult) <= filter.PriceMax.Value);
        if (filter.DurationDays.HasValue)
            query = query.Where(t => t.DurationDays == filter.DurationDays.Value);
        if (filter.IsActive.HasValue)
            query = query.Where(t => t.IsActive == filter.IsActive.Value);
        if (filter.IsFeatured.HasValue)
            query = query.Where(t => t.IsFeatured == filter.IsFeatured.Value);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        var data = _mapper.Map<List<TourResponse>>(items);
        // Gán số lượng đã đăng ký (chỉ tính booking chưa hủy)
        for (int i = 0; i < data.Count; i++)
        {
            data[i].RegisteredCount = items[i].Bookings
                .Count(b => b.Status != BookingStatus.Cancelled && b.Status != BookingStatus.Refunded);
        }
        return ApiResponse<PagedResult<TourResponse>>.Ok(
            new PagedResult<TourResponse>(data, total, filter.Page, filter.PageSize));
    }

    public async Task<ApiResponse<TourResponse>> GetByIdAsync(int id)
    {
        var tour = await _unitOfWork.Tours.GetQueryable()
            .Include(t => t.TourType)
            .Include(t => t.Images)
            .Include(t => t.Itineraries.OrderBy(i => i.DayNumber))
            .Include(t => t.Reviews)
            .Include(t => t.Bookings)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tour == null)
            return ApiResponse<TourResponse>.Fail("Tour not found", 404);

        var response = _mapper.Map<TourResponse>(tour);
        response.RegisteredCount = tour.Bookings
            .Count(b => b.Status != BookingStatus.Cancelled && b.Status != BookingStatus.Refunded);
        return ApiResponse<TourResponse>.Ok(response);
    }

    public async Task<ApiResponse<TourResponse>> GetBySlugAsync(string slug)
    {
        var tour = await _unitOfWork.Tours.GetQueryable()
            .Include(t => t.TourType)
            .Include(t => t.Images)
            .Include(t => t.Itineraries.OrderBy(i => i.DayNumber))
            .Include(t => t.Reviews)
            .FirstOrDefaultAsync(t => t.Slug == slug);

        if (tour == null)
            return ApiResponse<TourResponse>.Fail("Tour not found", 404);

        return ApiResponse<TourResponse>.Ok(_mapper.Map<TourResponse>(tour));
    }

    public async Task<ApiResponse<TourResponse>> CreateAsync(CreateTourRequest request, int userId)
    {
        var tour = _mapper.Map<Tour>(request);
        tour.CreatedBy = userId;
        tour.CreatedAt = DateTime.UtcNow;
        tour.IsActive = true;

        if (!string.IsNullOrEmpty(request.ImageUrl))
        {
            tour.Images.Add(new TourImage 
            { 
                ImageUrl = request.ImageUrl, 
                SortOrder = 0,
                CreatedAt = DateTime.UtcNow 
            });
        }

        await _unitOfWork.Tours.AddAsync(tour);
        await _unitOfWork.SaveChangesAsync();

        var result = await GetByIdAsync(tour.Id);
        return ApiResponse<TourResponse>.Ok(result.Data!, "Tour created successfully");
    }

    public async Task<ApiResponse<TourResponse>> UpdateAsync(int id, UpdateTourRequest request, int userId)
    {
        var tour = await _unitOfWork.Tours.GetQueryable()
            .Include(t => t.Images)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tour == null)
            return ApiResponse<TourResponse>.Fail("Tour not found", 404);

        _mapper.Map(request, tour);
        tour.UpdatedBy = userId;
        tour.UpdatedAt = DateTime.UtcNow;

        if (request.ImageUrl != null)
        {
            // Ảnh chính là ảnh có SortOrder = 0
            var primaryImage = tour.Images.OrderBy(img => img.SortOrder).FirstOrDefault();
            if (primaryImage != null)
            {
                primaryImage.ImageUrl = request.ImageUrl;
            }
            else
            {
                tour.Images.Add(new TourImage 
                { 
                    ImageUrl = request.ImageUrl, 
                    SortOrder = 0,
                    CreatedAt = DateTime.UtcNow 
                });
            }
        }

        await _unitOfWork.Tours.UpdateAsync(tour);
        await _unitOfWork.SaveChangesAsync();

        var result = await GetByIdAsync(tour.Id);
        return ApiResponse<TourResponse>.Ok(result.Data!, "Tour updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var tour = await _unitOfWork.Tours.GetByIdAsync(id);
        if (tour == null)
            return ApiResponse<bool>.Fail("Tour not found", 404);

        tour.IsDeleted = true;
        tour.DeletedAt = DateTime.UtcNow;
        await _unitOfWork.Tours.UpdateAsync(tour);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Tour deleted successfully");
    }

    public async Task<ApiResponse<TourResponse>> ToggleActiveAsync(int id, int userId)
    {
        var tour = await _unitOfWork.Tours.GetByIdAsync(id);
        if (tour == null)
            return ApiResponse<TourResponse>.Fail("Tour not found", 404);

        tour.IsActive = !tour.IsActive;
        tour.UpdatedBy = userId;
        tour.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.Tours.UpdateAsync(tour);
        await _unitOfWork.SaveChangesAsync();

        var result = await GetByIdAsync(tour.Id);
        return ApiResponse<TourResponse>.Ok(result.Data!,
            tour.IsActive ? "Tour đã được mở đăng ký" : "Tour đã đóng đăng ký");
    }
}
