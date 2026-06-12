using System.Globalization;

namespace Infrastructure.Extensions;

public static class DateTimeExtensions
{
    public static DateTime? ConvertStringToDateTime(string dateString)
    {
        DateTime parsedDate;
        bool isValid = DateTime.TryParseExact(
            dateString, 
            "dd/MM/yyyy", 
            CultureInfo.InvariantCulture, 
            DateTimeStyles.None, 
            out parsedDate
        );

        return isValid ? parsedDate : null;
    }
}