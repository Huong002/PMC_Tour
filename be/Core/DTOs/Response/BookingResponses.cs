namespace Core.DTOs.Response;

public class BookingResponse
{
    public int Id { get; set; }
    public string BookingCode { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int TourId { get; set; }
    public string TourName { get; set; } = string.Empty;
    public DateTime BookingDate { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int NumAdults { get; set; }
    public int NumChildren { get; set; }
    public decimal TotalPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal FinalPrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public string? DiscountCode { get; set; }
    public List<BookingDetailResponse> BookingDetails { get; set; } = new();
    public List<PaymentResponse> Payments { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public BookingTourResponse? Tour { get; set; }
    public BookingUserResponse? User { get; set; }
}

public class BookingTourResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<TourImageResponse> Images { get; set; } = new();
}

public class BookingUserResponse
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

public class BookingDetailResponse
{
    public int Id { get; set; }
    public string? FullName { get; set; }
    public string? PassportNumber { get; set; }
    public string? Note { get; set; }
}

public class PaymentResponse
{
    public int Id { get; set; }
    public int BookingId { get; set; }
    public string TransactionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
}
