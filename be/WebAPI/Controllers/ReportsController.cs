using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenueReport([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var result = await _reportService.GetRevenueReportAsync(fromDate, toDate);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("tours")]
    public async Task<IActionResult> GetTourReport([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var result = await _reportService.GetTourReportAsync(fromDate, toDate);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("bookings")]
    public async Task<IActionResult> GetBookingReport([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var result = await _reportService.GetBookingReportAsync(fromDate, toDate);
        return StatusCode(result.StatusCode, result);
    }
}
