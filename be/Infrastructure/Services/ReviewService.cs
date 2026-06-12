using AutoMapper;
using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Infrastructure.Services;

public class ReviewService : IReviewService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ReviewService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<ReviewResponse>>> GetByTourIdAsync(int tourId)
    {
        var reviews = await _unitOfWork.Reviews.GetQueryable()
            .Include(r => r.Customer)
            .Where(r => r.TourId == tourId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return ApiResponse<List<ReviewResponse>>.Ok(_mapper.Map<List<ReviewResponse>>(reviews));
    }

    public async Task<ApiResponse<ReviewResponse>> CreateAsync(CreateReviewRequest request)
    {
        var review = _mapper.Map<Review>(request);
        review.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.Reviews.AddAsync(review);
        await _unitOfWork.SaveChangesAsync();

        var result = await _unitOfWork.Reviews.GetQueryable()
            .Include(r => r.Customer)
            .FirstOrDefaultAsync(r => r.Id == review.Id);

        return ApiResponse<ReviewResponse>.Ok(_mapper.Map<ReviewResponse>(result), "Review created successfully");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var review = await _unitOfWork.Reviews.GetByIdAsync(id);
        if (review == null)
            return ApiResponse<bool>.Fail("Review not found", 404);

        review.IsDeleted = true;
        review.DeletedAt = DateTime.UtcNow;
        await _unitOfWork.Reviews.UpdateAsync(review);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Review deleted successfully");
    }
}
