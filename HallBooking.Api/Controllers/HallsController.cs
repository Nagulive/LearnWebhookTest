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
    private readonly IImageService _imageService;

    public HallsController(IApplicationDbContext context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HallResponseDto>>> GetHalls([FromQuery] string? state, [FromQuery] string? city, [FromQuery] double? lat, [FromQuery] double? lng, [FromQuery] double? radiusKm)
    {
        var query = _context.Halls
            .Include(h => h.Owner)
            .Where(h => h.IsApprovedByAdmin);

        if (!string.IsNullOrWhiteSpace(state))
            query = query.Where(h => h.State.ToLower() == state.ToLower());

        if (!string.IsNullOrWhiteSpace(city))
            query = query.Where(h => h.City.ToLower() == city.ToLower());

        var hallsList = await query.Select(h => new HallResponseDto
        {
            Id = h.Id,
            Name = h.Name,
            Description = h.Description,
            Capacity = h.Capacity,
            PricePerDay = h.PricePerDay,
            State = h.State,
            City = h.City,
            FullAddress = h.FullAddress,
            Latitude = h.Latitude,
            Longitude = h.Longitude,
            ImageUrl = h.ImageUrl,
            OwnerId = h.OwnerId,
            OwnerName = h.Owner.Name,
            IsApprovedByAdmin = h.IsApprovedByAdmin
        }).ToListAsync();

        // If coordinates are provided, perform Haversine distance filtering in-memory
        // (For production with millions of rows, use PostGIS directly in the DB query)
        if (lat.HasValue && lng.HasValue && radiusKm.HasValue)
        {
            // Note: Since Latitude/Longitude weren't explicitly selected in the DTO previously,
            // we should technically query the original entities and map after filtering.
            // For simplicity in this iteration, we refetch the entities that match.

            var allEntities = await query.ToListAsync();
            var filteredIds = new List<Guid>();

            foreach (var hall in allEntities)
            {
                var R = 6371; // Radius of earth in km
                var dLat = (hall.Latitude - lat.Value) * (Math.PI / 180);
                var dLon = (hall.Longitude - lng.Value) * (Math.PI / 180);
                var a =
                    Math.Sin(dLat/2) * Math.Sin(dLat/2) +
                    Math.Cos(lat.Value * (Math.PI / 180)) * Math.Cos(hall.Latitude * (Math.PI / 180)) *
                    Math.Sin(dLon/2) * Math.Sin(dLon/2);
                var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1-a));
                var distance = R * c;

                if (distance <= radiusKm.Value)
                {
                    filteredIds.Add(hall.Id);
                }
            }

            hallsList = hallsList.Where(h => filteredIds.Contains(h.Id)).ToList();
        }

        return Ok(hallsList);
    }

    [Authorize(Roles = "HallOwner")]
    [HttpGet("my-halls")]
    public async Task<ActionResult<IEnumerable<HallResponseDto>>> GetMyHalls()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !Guid.TryParse(userIdString, out Guid ownerId))
            return Unauthorized();

        var halls = await _context.Halls
            .Include(h => h.Owner)
            .Where(h => h.OwnerId == ownerId)
            .Select(h => new HallResponseDto
            {
                Id = h.Id,
                Name = h.Name,
                Description = h.Description,
                Capacity = h.Capacity,
                PricePerDay = h.PricePerDay,
                State = h.State,
                City = h.City,
                FullAddress = h.FullAddress,
                Latitude = h.Latitude,
                Longitude = h.Longitude,
                ImageUrl = h.ImageUrl,
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
            Latitude = hall.Latitude,
            Longitude = hall.Longitude,
            ImageUrl = hall.ImageUrl,
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
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
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

    [Authorize(Roles = "HallOwner")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHall(Guid id, CreateHallDto dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !Guid.TryParse(userIdString, out Guid ownerId))
            return Unauthorized();

        var hall = await _context.Halls.FindAsync(id);
        if (hall == null) return NotFound();

        // Resource Authorization: Only the owner can update their hall
        if (hall.OwnerId != ownerId) return Forbid();

        hall.Name = dto.Name;
        hall.Description = dto.Description;
        hall.Capacity = dto.Capacity;
        hall.PricePerDay = dto.PricePerDay;
        hall.State = dto.State;
        hall.City = dto.City;
        hall.FullAddress = dto.FullAddress;
        hall.Latitude = dto.Latitude;
        hall.Longitude = dto.Longitude;
        hall.IsApprovedByAdmin = false; // Require re-approval after edits

        await _context.SaveChangesAsync(default);

        return NoContent();
    }

    [Authorize(Roles = "HallOwner,Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHall(Guid id)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !Guid.TryParse(userIdString, out Guid userId))
            return Unauthorized();

        var role = User.FindFirstValue(ClaimTypes.Role);

        var hall = await _context.Halls.FindAsync(id);
        if (hall == null) return NotFound();

        // Only the owner or an admin can delete a hall
        if (role != "Admin" && hall.OwnerId != userId) return Forbid();

        _context.Halls.Remove(hall);
        await _context.SaveChangesAsync(default);

        return NoContent();
    }

    [Authorize(Roles = "HallOwner")]
    [HttpPost("{id}/image")]
    public async Task<IActionResult> UploadHallImage(Guid id, IFormFile file)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !Guid.TryParse(userIdString, out Guid ownerId))
            return Unauthorized();

        var hall = await _context.Halls.FindAsync(id);
        if (hall == null) return NotFound();

        if (hall.OwnerId != ownerId) return Forbid();

        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        try
        {
            var imageUrl = await _imageService.UploadImageAsync(file);
            hall.ImageUrl = imageUrl;
            await _context.SaveChangesAsync(default);
            return Ok(new { ImageUrl = imageUrl });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
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
