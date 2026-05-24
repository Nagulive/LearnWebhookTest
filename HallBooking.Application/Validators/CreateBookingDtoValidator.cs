using FluentValidation;
using HallBooking.Application.DTOs;

namespace HallBooking.Application.Validators;

public class CreateBookingDtoValidator : AbstractValidator<CreateBookingDto>
{
    public CreateBookingDtoValidator()
    {
        RuleFor(x => x.HallId).NotEmpty();
        RuleFor(x => x.EventType).IsInEnum();
        RuleFor(x => x.EventDate).GreaterThan(DateTime.UtcNow.Date)
            .WithMessage("Event date must be in the future.");
    }
}
