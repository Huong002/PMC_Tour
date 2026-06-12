namespace Core.DTOs.Response;

public class DashboardStatsResponse
{
    public int TotalTours { get; set; }
    public int ActiveTours { get; set; }
    public int TotalBookings { get; set; }
    public int PendingBookings { get; set; }
    public int ConfirmedBookings { get; set; }
    public int TotalCustomers { get; set; }
    public int TotalReviews { get; set; }
}

public class RecentBookingResponse
{
    public int Id { get; set; }
    public string BookingCode { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string TourName { get; set; } = string.Empty;
    public decimal FinalPrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class RevenueByMonthResponse
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal Revenue { get; set; }
    public int BookingCount { get; set; }
}
