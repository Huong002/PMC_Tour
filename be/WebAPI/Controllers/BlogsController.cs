using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Core.DTOs.Request;
using Core.Interfaces;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogsController : ControllerBase
{
    private readonly IBlogService _blogService;

    public BlogsController(IBlogService blogService)
    {
        _blogService = blogService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PagedRequest request)
    {
        var result = await _blogService.GetAllAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _blogService.GetByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await _blogService.GetBySlugAsync(slug);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBlogRequest request)
    {
        var result = await _blogService.CreateAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBlogRequest request)
    {
        var result = await _blogService.UpdateAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _blogService.DeleteAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}
