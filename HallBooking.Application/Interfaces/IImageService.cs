using Microsoft.AspNetCore.Http;

namespace HallBooking.Application.Interfaces;

public interface IImageService
{
    Task<string> UploadImageAsync(IFormFile file);
}
