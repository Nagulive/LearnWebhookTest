using HallBooking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HallBooking.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Hall> Halls { get; }
    DbSet<Booking> Bookings { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
