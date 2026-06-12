using Core.DTOs.Request;
using FluentValidation;

namespace Core.Validators;

public class CreateBlogRequestValidator : AbstractValidator<CreateBlogRequest>
{
    public CreateBlogRequestValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Content).NotEmpty();
        RuleFor(x => x.Excerpt).MaximumLength(500);
        RuleFor(x => x.Author).MaximumLength(100);
    }
}

public class UpdateBlogRequestValidator : AbstractValidator<UpdateBlogRequest>
{
    public UpdateBlogRequestValidator()
    {
        When(x => x.Title != null, () => RuleFor(x => x.Title!).MaximumLength(200));
        When(x => x.Slug != null, () => RuleFor(x => x.Slug!).MaximumLength(200));
        When(x => x.Content != null, () => RuleFor(x => x.Content!).NotEmpty());
        When(x => x.Excerpt != null, () => RuleFor(x => x.Excerpt!).MaximumLength(500));
    }
}
