using Microsoft.AspNetCore.Mvc;

namespace HallBooking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // Minimal mock for demonstration
    // In reality, this would inject a service that handles password hashing & JWT generation

    [HttpPost("login")]
    public IActionResult Login()
    {
        return Ok(new { Token = "mock-jwt-token-replace-with-real-implementation" });
    }

    [HttpPost("register")]
    public IActionResult Register()
    {
        return Ok(new { Message = "User registered successfully" });
    }
}
