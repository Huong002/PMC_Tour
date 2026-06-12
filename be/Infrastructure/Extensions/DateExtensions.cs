using System.Text.RegularExpressions;

namespace Infrastructure.Extensions;

public static class DateExtensions
{
    public static int? ToMonthNumber(this string monthString)
    {
        if (string.IsNullOrWhiteSpace(monthString))
            return null;

        var match = Regex.Match(monthString, @"\d+");

        return match.Success ? int.Parse(match.Value) : null;
    }
}