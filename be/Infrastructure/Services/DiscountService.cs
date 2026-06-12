using AutoMapper;
using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Infrastructure.Services;

public class DiscountService : IDiscountService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DiscountService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedResult<DiscountResponse>>> GetAllAsync(PagedRequest request)
    {
        var query = _unitOfWork.Discounts.GetQueryable().AsQueryable();

        if (!string.IsNullOrEmpty(request.SearchTerm))
            query = query.Where(d => d.Code.Contains(request.SearchTerm));

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(d => d.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var data = _mapper.Map<List<DiscountResponse>>(items);
        return ApiResponse<PagedResult<DiscountResponse>>.Ok(
            new PagedResult<DiscountResponse>(data, total, request.Page, request.PageSize));
    }

    public async Task<ApiResponse<DiscountResponse>> GetByIdAsync(int id)
    {
        var discount = await _unitOfWork.Discounts.GetByIdAsync(id);
        if (discount == null)
            return ApiResponse<DiscountResponse>.Fail("Discount not found", 404);

        return ApiResponse<DiscountResponse>.Ok(_mapper.Map<DiscountResponse>(discount));
    }

    public async Task<ApiResponse<DiscountResponse>> GetByCodeAsync(string code)
    {
        var discount = await _unitOfWork.Discounts.FirstOrDefaultAsync(d => d.Code == code && d.IsActive);
        if (discount == null)
            return ApiResponse<DiscountResponse>.Fail("Discount not found or expired", 404);

        return ApiResponse<DiscountResponse>.Ok(_mapper.Map<DiscountResponse>(discount));
    }

    public async Task<ApiResponse<DiscountResponse>> CreateAsync(CreateDiscountRequest request)
    {
        if (await _unitOfWork.Discounts.AnyAsync(d => d.Code == request.Code))
            return ApiResponse<DiscountResponse>.Fail("Discount code already exists");

        var discount = _mapper.Map<Discount>(request);
        discount.CreatedAt = DateTime.UtcNow;
        discount.IsActive = true;

        await _unitOfWork.Discounts.AddAsync(discount);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<DiscountResponse>.Ok(_mapper.Map<DiscountResponse>(discount), "Discount created successfully");
    }

    public async Task<ApiResponse<DiscountResponse>> UpdateAsync(int id, UpdateDiscountRequest request)
    {
        var discount = await _unitOfWork.Discounts.GetByIdAsync(id);
        if (discount == null)
            return ApiResponse<DiscountResponse>.Fail("Discount not found", 404);

        _mapper.Map(request, discount);
        discount.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Discounts.UpdateAsync(discount);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<DiscountResponse>.Ok(_mapper.Map<DiscountResponse>(discount), "Discount updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var discount = await _unitOfWork.Discounts.GetByIdAsync(id);
        if (discount == null)
            return ApiResponse<bool>.Fail("Discount not found", 404);

        discount.IsDeleted = true;
        discount.DeletedAt = DateTime.UtcNow;
        await _unitOfWork.Discounts.UpdateAsync(discount);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Discount deleted successfully");
    }
}
