using Core.DTOs.Response;
using Shared;

namespace Core.Interfaces;

public interface IDashboardService
{
    Task<ApiResponse<DashboardStatsResponse>> GetStatsAsync();
}
