using Microsoft.AspNetCore.Mvc;
using Core.DTOs.Request;
using Core.Interfaces;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("tour/{tourId:int}")]
    public async Task<IActionResult> GetByTourId(int tourId)
    {
        var result = await _reviewService.GetByTourIdAsync(tourId);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewRequest request)
    {
        var result = await _reviewService.CreateAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _reviewService.DeleteAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}
