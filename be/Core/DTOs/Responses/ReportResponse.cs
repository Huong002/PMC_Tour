namespace Core.DTOs.Responses;

public class GetReportExportFileDto
{
    public string PersonCode { get; set; }
    public string FullName { get; set; }
    public bool[] IsAttendances { get; set; }
}

public class GetGroupReportExportFileDto
{
    public string Month { get; set; }
    public List<GetReportExportFileDto> Reports { get; set; }
}