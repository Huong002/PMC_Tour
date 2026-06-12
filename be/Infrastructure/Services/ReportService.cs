using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.DTOs.Requests;
using Core.DTOs.Responses;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    public ReportService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<GetReportExportFileDto>> ExportReport(ReportRequest request, CancellationToken cancellationToken)
    {
        var users = await _context.UserSync
            .Where(x => x.DepartmentId == request.DepartmentCode && x.IsDeleted != true)
            .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        DateTime firstDayOfMonth = new DateTime(request.Date.Year, request.Date.Month, 1);
        DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

        var personCodes = users.Select(u => u.UserName).ToHashSet();

        var recognitionResults = await _context.FaceIDRecognitionResults
            .Where(x => personCodes.Contains(x.PersonCode) &&
                        x.RecordedTime >= firstDayOfMonth &&
                        x.RecordedTime <= lastDayOfMonth)
            .Select(x => new { x.PersonCode, x.RecordedTime })
            .ToListAsync(cancellationToken);

        var attendanceDays = recognitionResults
            .GroupBy(x => x.PersonCode)
            .ToDictionary(
                g => g.Key,
                g => g.Select(x => x.RecordedTime.Date).Distinct().ToHashSet()
            );

        var totalDays = (lastDayOfMonth - firstDayOfMonth).Days + 1;

        return users.Select(u => new GetReportExportFileDto
        {
            PersonCode = u.UserName,
            FullName = u.FullName,
            IsAttendances = Enumerable.Range(0, totalDays)
                .Select(i => attendanceDays.TryGetValue(u.UserName, out var days) && days.Contains(firstDayOfMonth.AddDays(i)))
                .ToArray()
        }).ToList();
    }
    
    public async Task<List<GetGroupReportExportFileDto>> ExportReport(ReportAttendRequest request, CancellationToken cancellationToken)
    {
        var users = await _context.UserSync
            .Where(x => x.DepartmentId == request.DepartmentCode && x.IsDeleted != true)
            .ProjectTo<UserByDepartment>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        var personCodes = users.Select(u => u.UserName).ToHashSet();
        var listData = new List<GetGroupReportExportFileDto>();
        var months = request.Months.Split(",");

        foreach (var month in months)
        {
            var item = new GetGroupReportExportFileDto { Month = month };
            DateTime firstDayOfMonth = new DateTime(int.Parse(request.Year), month.ToMonthNumber()!.Value, 1);
            DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            var recognitionResults = await _context.FaceIDRecognitionResults
                .Where(x => personCodes.Contains(x.PersonCode) &&
                            x.RecordedTime >= firstDayOfMonth &&
                            x.RecordedTime <= lastDayOfMonth)
                .Select(x => new { x.PersonCode, x.RecordedTime })
                .ToListAsync(cancellationToken);

            var attendanceDays = recognitionResults
                .GroupBy(x => x.PersonCode)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(x => x.RecordedTime.Date).Distinct().ToHashSet()
                );

            var totalDays = (lastDayOfMonth - firstDayOfMonth).Days + 1;

            item.Reports = users.Select(u => new GetReportExportFileDto
            {
                PersonCode = u.UserName,
                FullName = u.FullName,
                IsAttendances = Enumerable.Range(0, totalDays)
                    .Select(i => attendanceDays.TryGetValue(u.UserName, out var days) && days.Contains(firstDayOfMonth.AddDays(i)))
                    .ToArray()
            }).ToList();

            listData.Add(item);
        }
        return listData;
    }
}