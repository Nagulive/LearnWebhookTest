using FluentValidation;
using HallBooking.Application.DTOs;

namespace HallBooking.Application.Validators;

public class CreateHallDtoValidator : AbstractValidator<CreateHallDto>
{
    public CreateHallDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Description).NotEmpty();
        RuleFor(x => x.Capacity).GreaterThan(0);
        RuleFor(x => x.PricePerDay).GreaterThan(0);
        RuleFor(x => x.State).NotEmpty();
        RuleFor(x => x.City).NotEmpty();
        RuleFor(x => x.FullAddress).NotEmpty();
    }
}
