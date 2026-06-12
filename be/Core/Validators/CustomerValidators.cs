using Core.DTOs.Request;
using FluentValidation;

namespace Core.Validators;

public class CreateCustomerRequestValidator : AbstractValidator<CreateCustomerRequest>
{
    public CreateCustomerRequestValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).MaximumLength(100).EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
        RuleFor(x => x.Phone).MaximumLength(20);
        RuleFor(x => x.PassportNumber).MaximumLength(50);
        RuleFor(x => x.IdCard).MaximumLength(50);
    }
}

public class UpdateCustomerRequestValidator : AbstractValidator<UpdateCustomerRequest>
{
    public UpdateCustomerRequestValidator()
    {
        When(x => x.FullName != null, () => RuleFor(x => x.FullName!).MaximumLength(100));
        When(x => x.Email != null, () => RuleFor(x => x.Email!).MaximumLength(100).EmailAddress());
        When(x => x.Phone != null, () => RuleFor(x => x.Phone!).MaximumLength(20));
    }
}
