using Core.DTOs.Request;
using FluentValidation;

namespace Core.Validators;

public class CreateReviewRequestValidator : AbstractValidator<CreateReviewRequest>
{
    public CreateReviewRequestValidator()
    {
        RuleFor(x => x.TourId).GreaterThan(0);
        RuleFor(x => x.CustomerId).GreaterThan(0);
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Comment).MaximumLength(2000);
    }
}
