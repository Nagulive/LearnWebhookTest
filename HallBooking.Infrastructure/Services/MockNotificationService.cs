namespace HallBooking.Infrastructure.Services;

// A stub for an application interface we will create in the next step.
// We use this stub so development can proceed quickly without actual third-party setup.

using HallBooking.Application.Interfaces;

public class MockNotificationService : INotificationService
{
    public Task SendSmsAsync(string phoneNumber, string message)
    {
        Console.WriteLine($"[SMS to {phoneNumber}]: {message}");
        return Task.CompletedTask;
    }

    public Task SendEmailAsync(string email, string subject, string body)
    {
        Console.WriteLine($"[EMAIL to {email} | {subject}]: {body}");
        return Task.CompletedTask;
    }
}
