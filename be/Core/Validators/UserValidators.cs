using Core.DTOs.Request;
using FluentValidation;

namespace Core.Validators;

public class CreateUserRequestValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserRequestValidator()
    {
        RuleFor(x => x.Username).NotEmpty().MinimumLength(3).MaximumLength(50);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(100);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6).MaximumLength(100);
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Phone).MaximumLength(20);
    }
}

public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        When(x => x.Email != null, () => RuleFor(x => x.Email!).EmailAddress().MaximumLength(100));
        When(x => x.FullName != null, () => RuleFor(x => x.FullName!).MaximumLength(100));
        When(x => x.Phone != null, () => RuleFor(x => x.Phone!).MaximumLength(20));
    }
}
