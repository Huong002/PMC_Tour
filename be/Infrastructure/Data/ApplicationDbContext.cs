using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<Tour> Tours => Set<Tour>();
    public DbSet<TourType> TourTypes => Set<TourType>();
    public DbSet<TourImage> TourImages => Set<TourImage>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<BookingDetail> BookingDetails => Set<BookingDetail>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Discount> Discounts => Set<Discount>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Blog> Blogs => Set<Blog>();
    public DbSet<BlogCategory> BlogCategories => Set<BlogCategory>();
    public DbSet<Itinerary> Itineraries => Set<Itinerary>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // === User ===
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(x => x.Username).IsUnique();
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.Username).HasMaxLength(50);
            e.Property(x => x.Email).HasMaxLength(100);
            e.Property(x => x.FullName).HasMaxLength(100);
            e.Property(x => x.Phone).HasMaxLength(20);
            e.Property(x => x.PasswordHash).HasMaxLength(500);
            e.Property(x => x.RefreshToken).HasMaxLength(500);
        });

        // === Role ===
        modelBuilder.Entity<Role>(e =>
        {
            e.HasIndex(x => x.Name).IsUnique();
            e.Property(x => x.Name).HasMaxLength(50);
            e.Property(x => x.Description).HasMaxLength(200);
        });

        // === UserRole ===
        modelBuilder.Entity<UserRole>(e =>
        {
            e.HasKey(x => new { x.UserId, x.RoleId });
            e.HasOne(x => x.User).WithMany(x => x.UserRoles).HasForeignKey(x => x.UserId);
            e.HasOne(x => x.Role).WithMany(x => x.UserRoles).HasForeignKey(x => x.RoleId);
        });

        // === Tour ===
        modelBuilder.Entity<Tour>(e =>
        {
            e.HasIndex(x => x.Slug).IsUnique();
            e.HasIndex(x => x.Code).IsUnique();
            e.Property(x => x.Name).HasMaxLength(200);
            e.Property(x => x.Slug).HasMaxLength(200);
            e.Property(x => x.Code).HasMaxLength(50);
            e.Property(x => x.Location).HasMaxLength(200);
            e.Property(x => x.ShortDescription).HasMaxLength(500);
            e.Property(x => x.Description).HasColumnType("text");
            e.Property(x => x.Included).HasColumnType("text");
            e.Property(x => x.Excluded).HasColumnType("text");
            e.Property(x => x.Note).HasColumnType("text");
            e.Property(x => x.Transportation).HasMaxLength(500);
            e.Property(x => x.Hotel).HasMaxLength(500);
            e.Property(x => x.PriceAdult).HasColumnType("decimal(18,2)");
            e.Property(x => x.PriceChild).HasColumnType("decimal(18,2)");
            e.Property(x => x.PriceInfant).HasColumnType("decimal(18,2)");
            e.Property(x => x.SalePrice).HasColumnType("decimal(18,2)");
            e.Property(x => x.Status).HasDefaultValue(Core.Enums.TourStatus.Active);
            e.HasOne(x => x.TourType).WithMany(x => x.Tours).HasForeignKey(x => x.TourTypeId);
            e.HasOne(x => x.CreatedByUser).WithMany().HasForeignKey(x => x.CreatedBy).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.UpdatedByUser).WithMany().HasForeignKey(x => x.UpdatedBy).OnDelete(DeleteBehavior.NoAction);
        });

        // === TourType ===
        modelBuilder.Entity<TourType>(e =>
        {
            e.HasIndex(x => x.Slug).IsUnique();
            e.Property(x => x.Name).HasMaxLength(100);
            e.Property(x => x.Slug).HasMaxLength(100);
            e.Property(x => x.Description).HasMaxLength(500);
            e.Property(x => x.Icon).HasMaxLength(200);
        });

        // === TourImage ===
        modelBuilder.Entity<TourImage>(e =>
        {
            e.Property(x => x.ImageUrl).HasMaxLength(500);
            e.Property(x => x.AltText).HasMaxLength(200);
            e.HasOne(x => x.Tour).WithMany(x => x.Images).HasForeignKey(x => x.TourId).OnDelete(DeleteBehavior.Cascade);
        });

        // === Booking ===
        modelBuilder.Entity<Booking>(e =>
        {
            e.Property(x => x.BookingCode).HasMaxLength(50);
            e.Property(x => x.Notes).HasMaxLength(1000);
            e.HasIndex(x => x.BookingCode).IsUnique();
            e.HasOne(x => x.Customer).WithMany(x => x.Bookings).HasForeignKey(x => x.CustomerId);
            e.HasOne(x => x.Tour).WithMany(x => x.Bookings).HasForeignKey(x => x.TourId);
            e.HasOne(x => x.Discount).WithMany(x => x.Bookings).HasForeignKey(x => x.DiscountId).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.CreatedByUser).WithMany().HasForeignKey(x => x.CreatedBy).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.UpdatedByUser).WithMany().HasForeignKey(x => x.UpdatedBy).OnDelete(DeleteBehavior.NoAction);
        });

        // === BookingDetail ===
        modelBuilder.Entity<BookingDetail>(e =>
        {
            e.Property(x => x.FullName).HasMaxLength(100);
            e.Property(x => x.PassportNumber).HasMaxLength(50);
            e.Property(x => x.Note).HasMaxLength(500);
            e.HasOne(x => x.Booking).WithMany(x => x.BookingDetails).HasForeignKey(x => x.BookingId).OnDelete(DeleteBehavior.Cascade);
        });

        // === Customer ===
        modelBuilder.Entity<Customer>(e =>
        {
            e.Property(x => x.FullName).HasMaxLength(100);
            e.Property(x => x.Email).HasMaxLength(100);
            e.Property(x => x.Phone).HasMaxLength(20);
            e.Property(x => x.Address).HasMaxLength(200);
            e.Property(x => x.PassportNumber).HasMaxLength(50);
            e.Property(x => x.IdCard).HasMaxLength(50);
            e.Property(x => x.Nationality).HasMaxLength(50);
            e.HasIndex(x => x.Email);
            e.HasIndex(x => x.Phone);
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.SetNull);
        });

        // === Discount ===
        modelBuilder.Entity<Discount>(e =>
        {
            e.HasIndex(x => x.Code).IsUnique();
            e.Property(x => x.Code).HasMaxLength(50);
            e.Property(x => x.Description).HasMaxLength(500);
            e.Property(x => x.DiscountValue).HasColumnType("decimal(18,2)");
            e.Property(x => x.MinOrderValue).HasColumnType("decimal(18,2)");
            e.Property(x => x.MaxDiscountAmount).HasColumnType("decimal(18,2)");
        });

        // === Review ===
        modelBuilder.Entity<Review>(e =>
        {
            e.Property(x => x.Comment).HasMaxLength(2000);
            e.HasOne(x => x.Tour).WithMany(x => x.Reviews).HasForeignKey(x => x.TourId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Customer).WithMany(x => x.Reviews).HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.NoAction);
        });

        // === Blog ===
        modelBuilder.Entity<Blog>(e =>
        {
            e.HasIndex(x => x.Slug).IsUnique();
            e.Property(x => x.Title).HasMaxLength(200);
            e.Property(x => x.Slug).HasMaxLength(200);
            e.Property(x => x.Excerpt).HasMaxLength(500);
            e.Property(x => x.Author).HasMaxLength(100);
            e.Property(x => x.ThumbnailUrl).HasMaxLength(500);
            e.Property(x => x.Content).HasColumnType("text");
            e.Property(x => x.Tags).HasMaxLength(500);
        });

        // === BlogCategory ===
        modelBuilder.Entity<BlogCategory>(e =>
        {
            e.Property(x => x.Name).HasMaxLength(100);
            e.Property(x => x.Description).HasMaxLength(500);
        });

        // === Itinerary ===
        modelBuilder.Entity<Itinerary>(e =>
        {
            e.Property(x => x.Title).HasMaxLength(200);
            e.Property(x => x.Description).HasMaxLength(2000);
            e.Property(x => x.Activities).HasMaxLength(2000);
            e.Property(x => x.Timeline).HasMaxLength(4000);
            e.HasOne(x => x.Tour).WithMany(x => x.Itineraries).HasForeignKey(x => x.TourId).OnDelete(DeleteBehavior.Cascade);
        });

        // === Payment ===
        modelBuilder.Entity<Payment>(e =>
        {
            e.Property(x => x.PaymentMethod).HasMaxLength(50);
            e.Property(x => x.TransactionId).HasMaxLength(200);
            e.Property(x => x.Amount).HasColumnType("decimal(18,2)");
            e.Property(x => x.Note).HasMaxLength(500);
            e.HasOne(x => x.Booking).WithMany(x => x.Payments).HasForeignKey(x => x.BookingId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.CreatedByUser).WithMany().HasForeignKey(x => x.CreatedBy).OnDelete(DeleteBehavior.NoAction);
        });

        // === ContactMessage ===
        modelBuilder.Entity<ContactMessage>(e =>
        {
            e.Property(x => x.Name).HasMaxLength(100);
            e.Property(x => x.Email).HasMaxLength(100);
            e.Property(x => x.Subject).HasMaxLength(200);
            e.Property(x => x.Message).HasColumnType("text");
        });

        // === Global query filters ===
        modelBuilder.Entity<Tour>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<TourType>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Blog>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<BlogCategory>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Customer>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Discount>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<User>().HasQueryFilter(x => !x.IsDeleted);

        // === Seed data ===
        PmcTourSeeder.SeedAll(modelBuilder);
    }
}
