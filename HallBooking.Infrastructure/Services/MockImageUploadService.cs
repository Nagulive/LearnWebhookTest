using HallBooking.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace HallBooking.Infrastructure.Services;

public class MockImageUploadService : IImageService
{
    public Task<string> UploadImageAsync(IFormFile file)
    {
        // In a real application, this would upload the IFormFile stream to AWS S3,
        // Azure Blob Storage, or Cloudinary, and return the CDN URL.

        // For local development and demonstration, we simulate a delay and return a random placeholder image

        var randomId = Guid.NewGuid().ToString().Substring(0, 5);
        var mockUrl = $"https://picsum.photos/seed/{randomId}/800/600";

        return Task.FromResult(mockUrl);
    }
}
