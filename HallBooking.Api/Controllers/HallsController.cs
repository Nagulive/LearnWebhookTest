using HallBooking.Application.Interfaces;
using HallBooking.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HallBooking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HallsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public HallsController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Hall>>> GetHalls([FromQuery] string? state, [FromQuery] string? city)
    {
        var query = _context.Halls.AsQueryable();

        // Location targeting Kerala and Tamil Nadu focus
        if (!string.IsNullOrWhiteSpace(state))
        {
            query = query.Where(h => h.State.ToLower() == state.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(city))
        {
            query = query.Where(h => h.City.ToLower() == city.ToLower());
        }

        return await query.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Hall>> GetHall(Guid id)
    {
        var hall = await _context.Halls.FindAsync(id);

        if (hall == null)
        {
            return NotFound();
        }

        return hall;
    }
}
