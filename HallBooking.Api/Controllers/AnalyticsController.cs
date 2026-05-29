using HallBooking.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HallBooking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AnalyticsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public AnalyticsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAnalytics()
    {
        var totalUsers = await _context.Users.CountAsync();
        var totalHalls = await _context.Halls.CountAsync();
        var totalBookings = await _context.Bookings.CountAsync();
        var totalRevenue = await _context.Bookings.SumAsync(b => b.TotalAmount);

        return Ok(new
        {
            TotalUsers = totalUsers,
            TotalHalls = totalHalls,
            TotalBookings = totalBookings,
            TotalRevenue = totalRevenue
        });
    }
}
