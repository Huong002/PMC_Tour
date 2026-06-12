using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TourTypesController : ControllerBase
{
    private readonly ITourTypeService _tourTypeService;

    public TourTypesController(ITourTypeService tourTypeService)
    {
        _tourTypeService = tourTypeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _tourTypeService.GetAllAsync();
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _tourTypeService.GetByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}
