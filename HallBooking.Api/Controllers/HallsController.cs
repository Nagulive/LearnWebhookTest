using HallBooking.Application.DTOs;
using HallBooking.Application.Interfaces;
using HallBooking.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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
    public async Task<ActionResult<IEnumerable<HallResponseDto>>> GetHalls([FromQuery] string? state, [FromQuery] string? city)
    {
        var query = _context.Halls
            .Include(h => h.Owner)
            .Where(h => h.IsApprovedByAdmin);

        if (!string.IsNullOrWhiteSpace(state))
            query = query.Where(h => h.State.ToLower() == state.ToLower());

        if (!string.IsNullOrWhiteSpace(city))
            query = query.Where(h => h.City.ToLower() == city.ToLower());

        var halls = await query.Select(h => new HallResponseDto
        {
            Id = h.Id,
            Name = h.Name,
            Description = h.Description,
            Capacity = h.Capacity,
            PricePerDay = h.PricePerDay,
            State = h.State,
            City = h.City,
            FullAddress = h.FullAddress,
            OwnerId = h.OwnerId,
            OwnerName = h.Owner.Name,
            IsApprovedByAdmin = h.IsApprovedByAdmin
        }).ToListAsync();

        return Ok(halls);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HallResponseDto>> GetHall(Guid id)
    {
        var hall = await _context.Halls
            .Include(h => h.Owner)
            .FirstOrDefaultAsync(h => h.Id == id);

        if (hall == null) return NotFound();

        return Ok(new HallResponseDto
        {
            Id = hall.Id,
            Name = hall.Name,
            Description = hall.Description,
            Capacity = hall.Capacity,
            PricePerDay = hall.PricePerDay,
            State = hall.State,
            City = hall.City,
            FullAddress = hall.FullAddress,
            OwnerId = hall.OwnerId,
            OwnerName = hall.Owner.Name,
            IsApprovedByAdmin = hall.IsApprovedByAdmin
        });
    }

    [Authorize(Roles = "HallOwner")]
    [HttpPost]
    public async Task<ActionResult<HallResponseDto>> CreateHall(CreateHallDto dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !Guid.TryParse(userIdString, out Guid ownerId))
            return Unauthorized();

        var hall = new Hall
        {
            Name = dto.Name,
            Description = dto.Description,
            Capacity = dto.Capacity,
            PricePerDay = dto.PricePerDay,
            State = dto.State,
            City = dto.City,
            FullAddress = dto.FullAddress,
            OwnerId = ownerId,
            IsApprovedByAdmin = false // Requires Admin approval
        };

        _context.Halls.Add(hall);
        await _context.SaveChangesAsync(default);

        return CreatedAtAction(nameof(GetHall), new { id = hall.Id }, new HallResponseDto
        {
            Id = hall.Id,
            Name = hall.Name,
            IsApprovedByAdmin = hall.IsApprovedByAdmin
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("unapproved")]
    public async Task<ActionResult<IEnumerable<HallResponseDto>>> GetUnapprovedHalls()
    {
        var halls = await _context.Halls
            .Include(h => h.Owner)
            .Where(h => !h.IsApprovedByAdmin)
            .Select(h => new HallResponseDto
            {
                Id = h.Id,
                Name = h.Name,
                OwnerName = h.Owner.Name,
                IsApprovedByAdmin = h.IsApprovedByAdmin
            }).ToListAsync();

        return Ok(halls);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/approve")]
    public async Task<IActionResult> ApproveHall(Guid id)
    {
        var hall = await _context.Halls.FindAsync(id);
        if (hall == null) return NotFound();

        hall.IsApprovedByAdmin = true;
        await _context.SaveChangesAsync(default);

        return NoContent();
    }
}
