using AutoMapper;
using Core.DTOs.Response;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Infrastructure.Services;

public class TourTypeService : ITourTypeService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TourTypeService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<TourTypeResponse>>> GetAllAsync()
    {
        var types = await _unitOfWork.TourTypes.GetQueryable()
            .OrderBy(t => t.Name)
            .ToListAsync();

        return ApiResponse<List<TourTypeResponse>>.Ok(_mapper.Map<List<TourTypeResponse>>(types));
    }

    public async Task<ApiResponse<TourTypeResponse>> GetByIdAsync(int id)
    {
        var type = await _unitOfWork.TourTypes.GetByIdAsync(id);
        if (type == null)
            return ApiResponse<TourTypeResponse>.Fail("Tour type not found", 404);

        return ApiResponse<TourTypeResponse>.Ok(_mapper.Map<TourTypeResponse>(type));
    }
}
