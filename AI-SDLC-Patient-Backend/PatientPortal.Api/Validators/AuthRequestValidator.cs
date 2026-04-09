using FluentValidation;
using PatientPortal.Api.Models.Auth;

namespace PatientPortal.Api.Validators;

public class AuthRequestValidator : AbstractValidator<RegistrationRequest>
{
    public AuthRequestValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("fullName is required")
            .Length(2, 256).WithMessage("fullName must be between 2 and 256 characters")
            .Matches("^[A-Za-z\u00C0-\u017F'\\- ]+$")
            .WithMessage("fullName may include letters, spaces, hyphens, and apostrophes");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("email is required")
            .EmailAddress().WithMessage("Invalid email address")
            .MaximumLength(254).WithMessage("email must be 254 characters or fewer");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("password is required")
            .Length(8, 128).WithMessage("password must be between 8 and 128 characters")
            .Matches("[A-Z]").WithMessage("password must contain at least one uppercase letter")
            .Matches("[a-z]").WithMessage("password must contain at least one lowercase letter")
            .Matches("[0-9]").WithMessage("password must contain at least one number")
            .Matches("[^a-zA-Z0-9]").WithMessage("password must contain at least one special character");

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("confirmPassword is required")
            .Equal(x => x.Password).WithMessage("confirmPassword must match password");
    }
}
