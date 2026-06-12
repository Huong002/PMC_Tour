using Core.DTOs.Requests;
using Core.DTOs.Responses;

namespace Core.Interfaces;

public interface IReportService
{
    Task<List<GetReportExportFileDto>> ExportReport(ReportRequest request, CancellationToken cancellationToken = default);

    Task<List<GetGroupReportExportFileDto>> ExportReport(ReportAttendRequest request,
        CancellationToken cancellationToken);
}