using AutoMapper;
using Core.DTOs.Request;
using Core.DTOs.Response;
using Core.Entities;

namespace Core.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<RegisterRequest, User>();
        CreateMap<CreateUserRequest, User>();
        CreateMap<UpdateUserRequest, User>()
            .ForAllMembers(o => o.Condition((_, _, src) => src != null));

        CreateMap<User, UserResponse>()
            .ForMember(d => d.Roles, o => o.MapFrom(s => s.UserRoles.Select(ur => ur.Role.Name)));

        CreateMap<Tour, TourResponse>()
            .ForMember(d => d.TourTypeName, o => o.MapFrom(s => s.TourType.Name))
            .ForMember(d => d.Images, o => o.MapFrom(s => s.Images))
            .ForMember(d => d.Itineraries, o => o.MapFrom(s => s.Itineraries.OrderBy(i => i.DayNumber)));

        CreateMap<CreateTourRequest, Tour>();
        CreateMap<UpdateTourRequest, Tour>()
            .ForAllMembers(o => o.Condition((_, _, src) => src != null));

        CreateMap<TourType, TourTypeResponse>();

        CreateMap<TourImage, TourImageResponse>();

        CreateMap<Booking, BookingResponse>()
            .ForMember(d => d.CustomerName, o => o.MapFrom(s => s.Customer.FullName))
            .ForMember(d => d.TourName, o => o.MapFrom(s => s.Tour.Name));

        CreateMap<CreateBookingRequest, Booking>();
        CreateMap<BookingDetail, BookingDetailResponse>();

        CreateMap<Customer, CustomerResponse>()
            .ForMember(d => d.BookingCount, o => o.MapFrom(s => s.Bookings.Count));

        CreateMap<CreateCustomerRequest, Customer>();
        CreateMap<UpdateCustomerRequest, Customer>()
            .ForAllMembers(o => o.Condition((_, _, src) => src != null));

        CreateMap<Discount, DiscountResponse>();
        CreateMap<CreateDiscountRequest, Discount>();
        CreateMap<UpdateDiscountRequest, Discount>()
            .ForAllMembers(o => o.Condition((_, _, src) => src != null));

        CreateMap<Review, ReviewResponse>()
            .ForMember(d => d.CustomerName, o => o.MapFrom(s => s.Customer.FullName));

        CreateMap<CreateReviewRequest, Review>();

        CreateMap<Blog, BlogResponse>();
        CreateMap<CreateBlogRequest, Blog>();
        CreateMap<UpdateBlogRequest, Blog>()
            .ForAllMembers(o => o.Condition((_, _, src) => src != null));

        CreateMap<Itinerary, ItineraryResponse>();
        CreateMap<CreateItineraryRequest, Itinerary>();
        CreateMap<UpdateItineraryRequest, Itinerary>()
            .ForAllMembers(o => o.Condition((_, _, src) => src != null));

        CreateMap<Payment, PaymentResponse>();
    }
}
