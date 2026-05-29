namespace HallBooking.Domain.Entities;

public class Hall
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public decimal PricePerDay { get; set; }

    // Location Data (Targeting Kerala & Tamil Nadu)
    public string State { get; set; } = string.Empty; // e.g. "Kerala" or "Tamil Nadu"
    public string City { get; set; } = string.Empty;
    public string FullAddress { get; set; } = string.Empty;

    // Cloud Native tip: You would normally use PostGIS for this if doing spatial queries
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    // Image
    public string? ImageUrl { get; set; }

    // Ownership
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    // Verification
    public bool IsApprovedByAdmin { get; set; } = false;

    // Navigation
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
