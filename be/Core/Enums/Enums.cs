namespace Core.Enums;

public enum BookingStatus
{
    Pending,
    Confirmed,
    InProgress,
    Completed,
    Cancelled,
    Refunded
}

public enum PaymentStatus
{
    Unpaid,
    Partial,
    Paid,
    Refunded
}

public enum PaymentMethod
{
    Cash,
    BankTransfer,
    CreditCard,
    EWallet
}

public enum ReviewStatus
{
    Pending,
    Approved,
    Rejected
}

public enum TourStatus
{
    Active,             // Mở đăng ký
    Inactive,           // Đã đóng
    Pending,            // Chờ xác nhận
    Confirmed           // Đã xác nhận
}

public enum BlogStatus
{
    Draft,
    Published,
    Archived
}

public enum DiscountType
{
    Percentage,
    FixedAmount
}

public enum Gender
{
    Male,
    Female,
    Other
}
