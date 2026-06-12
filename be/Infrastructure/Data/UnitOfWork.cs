using Core.Interfaces;
using Core.Entities;

namespace Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private readonly Dictionary<Type, object> _repositories = new();

    private IGenericRepository<User>? _users;
    private IGenericRepository<Role>? _roles;
    private IGenericRepository<Tour>? _tours;
    private IGenericRepository<TourType>? _tourTypes;
    private IGenericRepository<TourImage>? _tourImages;
    private IGenericRepository<Booking>? _bookings;
    private IGenericRepository<BookingDetail>? _bookingDetails;
    private IGenericRepository<Customer>? _customers;
    private IGenericRepository<Discount>? _discounts;
    private IGenericRepository<Review>? _reviews;
    private IGenericRepository<Blog>? _blogs;
    private IGenericRepository<BlogCategory>? _blogCategories;
    private IGenericRepository<Itinerary>? _itineraries;
    private IGenericRepository<Payment>? _payments;
    private IGenericRepository<ContactMessage>? _contactMessages;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IGenericRepository<T> Repository<T>() where T : class
    {
        var type = typeof(T);
        if (!_repositories.ContainsKey(type))
        {
            var repo = new GenericRepository<T>(_context);
            _repositories[type] = repo;
        }
        return (IGenericRepository<T>)_repositories[type];
    }

    public IGenericRepository<User> Users => _users ??= new GenericRepository<User>(_context);
    public IGenericRepository<Role> Roles => _roles ??= new GenericRepository<Role>(_context);
    public IGenericRepository<Tour> Tours => _tours ??= new GenericRepository<Tour>(_context);
    public IGenericRepository<TourType> TourTypes => _tourTypes ??= new GenericRepository<TourType>(_context);
    public IGenericRepository<TourImage> TourImages => _tourImages ??= new GenericRepository<TourImage>(_context);
    public IGenericRepository<Booking> Bookings => _bookings ??= new GenericRepository<Booking>(_context);
    public IGenericRepository<BookingDetail> BookingDetails => _bookingDetails ??= new GenericRepository<BookingDetail>(_context);
    public IGenericRepository<Customer> Customers => _customers ??= new GenericRepository<Customer>(_context);
    public IGenericRepository<Discount> Discounts => _discounts ??= new GenericRepository<Discount>(_context);
    public IGenericRepository<Review> Reviews => _reviews ??= new GenericRepository<Review>(_context);
    public IGenericRepository<Blog> Blogs => _blogs ??= new GenericRepository<Blog>(_context);
    public IGenericRepository<BlogCategory> BlogCategories => _blogCategories ??= new GenericRepository<BlogCategory>(_context);
    public IGenericRepository<Itinerary> Itineraries => _itineraries ??= new GenericRepository<Itinerary>(_context);
    public IGenericRepository<Payment> Payments => _payments ??= new GenericRepository<Payment>(_context);
    public IGenericRepository<ContactMessage> ContactMessages => _contactMessages ??= new GenericRepository<ContactMessage>(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _context.Database.CommitTransactionAsync(cancellationToken);
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _context.Database.RollbackTransactionAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
