using HallBooking.Application.DTOs;
using HallBooking.Application.Interfaces;
using HallBooking.Domain.Entities;
using HallBooking.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HallBooking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly INotificationService _notificationService;
    private readonly IPaymentService _paymentService;

    public BookingsController(IApplicationDbContext context, INotificationService notificationService, IPaymentService paymentService)
    {
        _context = context;
        _notificationService = notificationService;
        _paymentService = paymentService;
    }

    [Authorize(Roles = "Customer")]
    [HttpPost]
    public async Task<ActionResult<BookingResponseDto>> CreateBooking(CreateBookingDto dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !Guid.TryParse(userIdString, out Guid customerId))
            return Unauthorized();

        var hall = await _context.Halls.Include(h => h.Owner).FirstOrDefaultAsync(h => h.Id == dto.HallId);
        if (hall == null) return NotFound("Hall not found.");
        if (!hall.IsApprovedByAdmin) return BadRequest("Hall is not approved for booking.");

        var booking = new Booking
        {
            HallId = dto.HallId,
            CustomerId = customerId,
            EventType = dto.EventType,
            EventDate = dto.EventDate,
            TotalAmount = hall.PricePerDay, // Simplification: 1 day booking
            Status = BookingStatus.Pending
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync(default);

        // Generate Razorpay Order
        var orderId = await _paymentService.CreatePaymentOrderAsync(booking.TotalAmount, "INR", booking.Id.ToString());
        booking.PaymentTransactionId = orderId;
        await _context.SaveChangesAsync(default);

        // Notify Owner
        await _notificationService.SendSmsAsync(hall.Owner.PhoneNumber, $"New Booking ID {booking.Id} for {hall.Name} on {dto.EventDate.ToShortDateString()}");

        return Ok(new BookingResponseDto
        {
            Id = booking.Id,
            HallId = booking.HallId,
            PaymentTransactionId = orderId,
            Status = booking.Status
        });
    }

    [HttpGet("my-bookings")]
    public async Task<ActionResult<IEnumerable<BookingResponseDto>>> GetMyBookings()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var role = User.FindFirstValue(ClaimTypes.Role);

        IQueryable<Booking> query = _context.Bookings
            .Include(b => b.Hall)
            .Include(b => b.Customer);

        if (role == "Customer")
        {
            query = query.Where(b => b.CustomerId == userId);
        }
        else if (role == "HallOwner")
        {
            query = query.Where(b => b.Hall.OwnerId == userId);
        }
        else
        {
            return Forbid();
        }

        var bookings = await query.Select(b => new BookingResponseDto
        {
            Id = b.Id,
            HallName = b.Hall.Name,
            CustomerName = b.Customer.Name,
            EventType = b.EventType,
            EventDate = b.EventDate,
            Status = b.Status,
            TotalAmount = b.TotalAmount
        }).ToListAsync();

        return Ok(bookings);
    }
}
