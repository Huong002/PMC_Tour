using Core.DTOs.Request;
using FluentValidation;

namespace Core.Validators;

public class CreateDiscountRequestValidator : AbstractValidator<CreateDiscountRequest>
{
    public CreateDiscountRequestValidator()
    {
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50);
        RuleFor(x => x.DiscountValue).GreaterThan(0);
        RuleFor(x => x.MinOrderValue).GreaterThanOrEqualTo(0).When(x => x.MinOrderValue.HasValue);
        RuleFor(x => x.MaxDiscountAmount).GreaterThan(0).When(x => x.MaxDiscountAmount.HasValue);
        RuleFor(x => x.UsageLimit).GreaterThan(0).When(x => x.UsageLimit.HasValue);
        RuleFor(x => x.StartDate).NotEmpty();
        RuleFor(x => x.EndDate).NotEmpty()
            .Must((req, endDate) => endDate > req.StartDate)
            .WithMessage("End date must be after start date");
    }
}

public class UpdateDiscountRequestValidator : AbstractValidator<UpdateDiscountRequest>
{
    public UpdateDiscountRequestValidator()
    {
        When(x => x.Code != null, () => RuleFor(x => x.Code!).MaximumLength(50));
        When(x => x.DiscountValue != null, () => RuleFor(x => x.DiscountValue!).GreaterThan(0));
    }
}
