using Core.DTOs.Request;
using FluentValidation;

namespace Core.Validators;

public class CreateItineraryRequestValidator : AbstractValidator<CreateItineraryRequest>
{
    public CreateItineraryRequestValidator()
    {
        RuleFor(x => x.TourId).GreaterThan(0);
        RuleFor(x => x.DayNumber).GreaterThan(0);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(2000);
        RuleFor(x => x.Activities).MaximumLength(2000);
    }
}

public class UpdateItineraryRequestValidator : AbstractValidator<UpdateItineraryRequest>
{
    public UpdateItineraryRequestValidator()
    {
        When(x => x.Title != null, () => RuleFor(x => x.Title!).MaximumLength(200));
        When(x => x.Description != null, () => RuleFor(x => x.Description!).MaximumLength(2000));
    }
}
