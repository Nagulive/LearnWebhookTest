using HallBooking.Domain.Enums;

namespace HallBooking.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public Role Role { get; set; }

    // Navigation Properties
    public ICollection<Hall> HallsOwned { get; set; } = new List<Hall>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
