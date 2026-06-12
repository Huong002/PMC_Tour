using ClosedXML.Excel;
using Core.DTOs.Requests;
using Core.DTOs.Responses;
using Core.Interfaces;
using Infrastructure.Extensions;
using Infrastructure.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

public class ReportsController : ApiControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet]
    [Route("export")]
    public async Task<ActionResult> Export([FromQuery] ReportRequest request, CancellationToken cancellationToken)
    {
        var result = await _reportService.ExportReport(request, cancellationToken);

        string template = ReportHelpers.GetTemplateByMonthInYear(request.Date);

        string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates/Reports", template);

        if (!System.IO.File.Exists(templatePath))
        {
            return NotFound("Template file not found.");
        }

        using (var memoryStream = new MemoryStream())
        {
            using (var workbook = new XLWorkbook(templatePath))
            {
                var worksheet = workbook.Worksheet(1);

                int row = 12;
                int index = 1;
                worksheet.Cell(6, 1).Value = $"Tháng {request.Date.Month} Năm {request.Date.Year}";
                foreach (var user in result)
                {
                    worksheet.Cell(row, 1).Value = index;
                    worksheet.Cell(row, 2).Value = user.FullName;
                    int column = 3;
                    for (int i = 0; i < user.IsAttendances.Length; i++)
                    {
                        worksheet.Cell(row, column + i).Value = user.IsAttendances[i] ? "x" : "";
                    }

                    row++;
                    index++;
                }

                workbook.SaveAs(memoryStream);
            }

            memoryStream.Position = 0;

            return File(memoryStream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"ReportAttendances_{request.DepartmentCode}.xlsx");
        }
    }

    [HttpGet]
    [Route("render-ui")]
    public async Task<ActionResult<List<GetReportExportFileDto>>> RenderUI([FromQuery] ReportRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _reportService.ExportReport(request, cancellationToken);

        return result;
    }


    [HttpGet]
    [Route("export-months")]
    public async Task<ActionResult> ExportWithMonths([FromQuery] ReportAttendRequest request,
        CancellationToken cancellationToken)
    {
        using (var memoryStream = new MemoryStream())
        {
            var result = await _reportService.ExportReport(request, cancellationToken);
            using (var mergedWorkbook = new XLWorkbook())
            {
                foreach (var item in result)
                {
                    string template = ReportHelpers.GetTemplateByMonthInYear(new DateTime(Int32.Parse(request.Year),
                        item.Month.ToMonthNumber().Value, 1));
                    string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates/Reports", template);
                    if (!System.IO.File.Exists(templatePath))
                    {
                        return NotFound("Template file not found.");
                    }

                    using (var workbook = new XLWorkbook(templatePath))
                    {
                        var worksheet = workbook.Worksheet(1);
                        worksheet.Name = item.Month;
                        int row = 12;
                        int index = 1;
                        worksheet.Cell(6, 1).Value = $"{item.Month} Năm {request.Year}";
                        foreach (var user in item.Reports)
                        {
                            worksheet.Cell(row, 1).Value = index;
                            worksheet.Cell(row, 2).Value = user.FullName;
                            int column = 3;
                            for (int i = 0; i < user.IsAttendances.Length; i++)
                            {
                                worksheet.Cell(row, column + i).Value = user.IsAttendances[i] ? "x" : "";
                            }

                            row++;
                            index++;
                        }

                        worksheet.CopyTo(mergedWorkbook, worksheet.Name);
                    }
                }
                mergedWorkbook.SaveAs(memoryStream);
            }
        
            memoryStream.Position = 0;

            return File(memoryStream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"ReportAttendances_{request.DepartmentCode}.xlsx");
        }
    }
}