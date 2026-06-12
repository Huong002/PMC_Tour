using Core.DTOs.Request;
using FluentValidation;

namespace Core.Validators;

public class CreateTourRequestValidator : AbstractValidator<CreateTourRequest>
{
    public CreateTourRequestValidator()
    {
        RuleFor(x => x.TourTypeId).GreaterThan(0);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(200);
        RuleFor(x => x.DurationDays).GreaterThan(0);
        RuleFor(x => x.DurationNights).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Location).NotEmpty().MaximumLength(200);
        RuleFor(x => x.PriceAdult).GreaterThanOrEqualTo(0);
        RuleFor(x => x.PriceChild).GreaterThanOrEqualTo(0);
        RuleFor(x => x.MaxPeople).GreaterThan(0);
    }
}

public class UpdateTourRequestValidator : AbstractValidator<UpdateTourRequest>
{
    public UpdateTourRequestValidator()
    {
        When(x => x.Name != null, () => RuleFor(x => x.Name!).MaximumLength(200));
        When(x => x.Slug != null, () => RuleFor(x => x.Slug!).MaximumLength(200));
        When(x => x.Location != null, () => RuleFor(x => x.Location!).MaximumLength(200));
        When(x => x.PriceAdult != null, () => RuleFor(x => x.PriceAdult!).GreaterThanOrEqualTo(0));
        When(x => x.PriceChild != null, () => RuleFor(x => x.PriceChild!).GreaterThanOrEqualTo(0));
        When(x => x.MaxPeople != null, () => RuleFor(x => x.MaxPeople!).GreaterThan(0));
    }
}

public class TourFilterRequestValidator : AbstractValidator<TourFilterRequest>
{
    public TourFilterRequestValidator()
    {
        RuleFor(x => x.Page).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
