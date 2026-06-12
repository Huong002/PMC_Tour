using Core.DTOs.Request;
using FluentValidation;

namespace Core.Validators;

public class CreateBookingRequestValidator : AbstractValidator<CreateBookingRequest>
{
    public CreateBookingRequestValidator()
    {
        RuleFor(x => x.CustomerId).GreaterThan(0);
        RuleFor(x => x.TourId).GreaterThan(0);
        RuleFor(x => x.StartDate).NotEmpty();
        RuleFor(x => x.EndDate).NotEmpty()
            .Must((req, endDate) => endDate > req.StartDate)
            .WithMessage("End date must be after start date");
        RuleFor(x => x.NumAdults).GreaterThan(0);
        RuleFor(x => x.NumChildren).GreaterThanOrEqualTo(0);
    }
}

public class BookingFilterRequestValidator : AbstractValidator<BookingFilterRequest>
{
    public BookingFilterRequestValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
