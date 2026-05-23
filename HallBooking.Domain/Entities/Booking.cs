using HallBooking.Domain.Enums;

namespace HallBooking.Domain.Entities;

public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();

    // Foreign Keys
    public Guid HallId { get; set; }
    public Hall Hall { get; set; } = null!;

    public Guid CustomerId { get; set; }
    public User Customer { get; set; } = null!;

    // Booking Details
    public EventType EventType { get; set; }
    public DateTime EventDate { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public decimal TotalAmount { get; set; }

    // Payment Tracking
    public string? PaymentTransactionId { get; set; }

    // Audit
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
