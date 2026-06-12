namespace Core.DTOs.Requests;

public record ReportRequest(string DepartmentCode, DateTime Date);
public record ReportAttendRequest(string DepartmentCode, string Year, string Months, string FileName = "File Export.xlxs");