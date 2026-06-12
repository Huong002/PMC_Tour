using Core.Enums;

namespace Core.DTOs.Request;

public class CreateBookingRequest
{
    public int CustomerId { get; set; }
    public int TourId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int NumAdults { get; set; }
    public int NumChildren { get; set; }
    public string? Notes { get; set; }
    public string? DiscountCode { get; set; }
    public BookingDetailRequest? BookingDetail { get; set; }
}

public class BookingDetailRequest
{
    public string? FullName { get; set; }
    public string? PassportNumber { get; set; }
    public string? Note { get; set; }
}

public class UpdateBookingStatusRequest
{
    public BookingStatus Status { get; set; }
}

public class UpdateBookingPaymentRequest
{
    public PaymentStatus PaymentStatus { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }
}

public class BookingFilterRequest
{
    public int? CustomerId { get; set; }
    public int? TourId { get; set; }
    public BookingStatus? Status { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? SearchTerm { get; set; }
    public string? BookingCode { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
