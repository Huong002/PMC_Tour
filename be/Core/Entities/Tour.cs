using Shared;

namespace Core.Entities;

public class Tour : BaseEntity
{
    public int TourTypeId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public int DurationDays { get; set; }
    public int DurationNights { get; set; }
    public string Location { get; set; } = string.Empty;
    public decimal PriceAdult { get; set; }
    public decimal PriceChild { get; set; }
    public decimal PriceInfant { get; set; }
    public int MaxPeople { get; set; }
    public decimal? SalePrice { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; }
    public string? ShortDescription { get; set; }
    public string? Description { get; set; }
    public string? Included { get; set; }
    public string? Excluded { get; set; }
    public string? Note { get; set; }
    public string? Transportation { get; set; }
    public string? Hotel { get; set; }
    public int CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }

    public TourType TourType { get; set; } = null!;
    public ICollection<TourImage> Images { get; set; } = new List<TourImage>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Itinerary> Itineraries { get; set; } = new List<Itinerary>();
    public User CreatedByUser { get; set; } = null!;
    public User? UpdatedByUser { get; set; }
}
