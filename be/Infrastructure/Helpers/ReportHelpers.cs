namespace Infrastructure.Helpers;

public class ReportHelpers
{
    public static string GetTemplateByMonthInYear(DateTime date)
    {
        int daysInMonth = DateTime.DaysInMonth(date.Year, date.Month);
        switch (daysInMonth)
        {
            case 28: return "Timesheet_Template_28Days.xlsx";
            case 29: return "Timesheet_Template_29Days.xlsx";
            case 30: return "Timesheet_Template_30Days.xlsx";
            case 31: return "Timesheet_Template_31Days.xlsx";
            default: return string.Empty;
        }
    }
}