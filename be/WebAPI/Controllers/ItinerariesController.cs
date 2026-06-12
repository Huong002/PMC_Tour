using Microsoft.AspNetCore.Mvc;
using Core.DTOs.Request;
using Core.Interfaces;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItinerariesController : ControllerBase
{
    private readonly IItineraryService _itineraryService;

    public ItinerariesController(IItineraryService itineraryService)
    {
        _itineraryService = itineraryService;
    }

    [HttpGet("tour/{tourId:int}")]
    public async Task<IActionResult> GetByTourId(int tourId)
    {
        var result = await _itineraryService.GetByTourIdAsync(tourId);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateItineraryRequest request)
    {
        var result = await _itineraryService.CreateAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateItineraryRequest request)
    {
        var result = await _itineraryService.UpdateAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _itineraryService.DeleteAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}
