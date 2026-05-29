using HallBooking.Domain.Enums;

namespace HallBooking.Application.DTOs;

public class CreateBookingDto
{
    public Guid HallId { get; set; }
    public EventType EventType { get; set; }
    public DateTime EventDate { get; set; }
}

public class BookingResponseDto
{
    public Guid Id { get; set; }
    public Guid HallId { get; set; }
    public string HallName { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public EventType EventType { get; set; }
    public DateTime EventDate { get; set; }
    public BookingStatus Status { get; set; }
    public decimal TotalAmount { get; set; }
    public string? PaymentTransactionId { get; set; }
    public DateTime CreatedAt { get; set; }
}
