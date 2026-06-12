using AutoMapper;
using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Infrastructure.Services;

public class ItineraryService : IItineraryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ItineraryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<ItineraryResponse>>> GetByTourIdAsync(int tourId)
    {
        var itineraries = await _unitOfWork.Itineraries.GetQueryable()
            .Where(i => i.TourId == tourId)
            .OrderBy(i => i.DayNumber)
            .ToListAsync();

        return ApiResponse<List<ItineraryResponse>>.Ok(_mapper.Map<List<ItineraryResponse>>(itineraries));
    }

    public async Task<ApiResponse<ItineraryResponse>> CreateAsync(CreateItineraryRequest request)
    {
        var itinerary = _mapper.Map<Itinerary>(request);
        itinerary.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.Itineraries.AddAsync(itinerary);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<ItineraryResponse>.Ok(_mapper.Map<ItineraryResponse>(itinerary), "Itinerary created successfully");
    }

    public async Task<ApiResponse<ItineraryResponse>> UpdateAsync(int id, UpdateItineraryRequest request)
    {
        var itinerary = await _unitOfWork.Itineraries.GetByIdAsync(id);
        if (itinerary == null)
            return ApiResponse<ItineraryResponse>.Fail("Itinerary not found", 404);

        _mapper.Map(request, itinerary);
        itinerary.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Itineraries.UpdateAsync(itinerary);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<ItineraryResponse>.Ok(_mapper.Map<ItineraryResponse>(itinerary), "Itinerary updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var itinerary = await _unitOfWork.Itineraries.GetByIdAsync(id);
        if (itinerary == null)
            return ApiResponse<bool>.Fail("Itinerary not found", 404);

        await _unitOfWork.Itineraries.DeleteAsync(itinerary);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<bool>.Ok(true, "Itinerary deleted successfully");
    }
}
