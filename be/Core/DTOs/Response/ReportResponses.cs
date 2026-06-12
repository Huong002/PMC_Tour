namespace Core.DTOs.Response;

public class RevenueReportResponse
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TotalPayments { get; set; }
    public int SuccessfulPayments { get; set; }
}

public class TourReportResponse
{
    public int TourId { get; set; }
    public string TourName { get; set; } = string.Empty;
    public int TotalBookings { get; set; }
    public double AverageRating { get; set; }
}

public class BookingReportResponse
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int Total { get; set; }
    public int Pending { get; set; }
    public int Confirmed { get; set; }
    public int Completed { get; set; }
    public int Cancelled { get; set; }
}
