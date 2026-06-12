using Core.Entities;

namespace Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<User> Users { get; }
    IGenericRepository<Customer> Customers { get; }
    IGenericRepository<Tour> Tours { get; }
    IGenericRepository<TourType> TourTypes { get; }
    IGenericRepository<TourImage> TourImages { get; }
    IGenericRepository<Booking> Bookings { get; }
    IGenericRepository<BookingDetail> BookingDetails { get; }
    IGenericRepository<Review> Reviews { get; }
    IGenericRepository<Itinerary> Itineraries { get; }
    IGenericRepository<Discount> Discounts { get; }
    IGenericRepository<Payment> Payments { get; }
    IGenericRepository<Blog> Blogs { get; }
    IGenericRepository<Role> Roles { get; }
    IGenericRepository<BlogCategory> BlogCategories { get; }

    IGenericRepository<T> Repository<T>() where T : class;

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
