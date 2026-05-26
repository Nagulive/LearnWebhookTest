using HallBooking.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace HallBooking.Infrastructure.Services;

public class RealNotificationService : INotificationService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<RealNotificationService> _logger;

    public RealNotificationService(IConfiguration configuration, ILogger<RealNotificationService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string email, string subject, string body)
    {
        string apiKey = _configuration["SendGrid:ApiKey"] ?? "mock_sendgrid_key";
        if (apiKey == "mock_sendgrid_key")
        {
            _logger.LogInformation("MOCK Email sent to {Email} with subject {Subject}", email, subject);
            return;
        }

        try
        {
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("noreply@hallbooking.com", "Hall Booking Platform");
            var to = new EmailAddress(email);
            var plainTextContent = body;
            var htmlContent = $"<strong>{body}</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            await client.SendEmailAsync(msg);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email via SendGrid.");
        }
    }

    public async Task SendSmsAsync(string phoneNumber, string message)
    {
        string accountSid = _configuration["Twilio:AccountSid"] ?? "mock_twilio_sid";
        string authToken = _configuration["Twilio:AuthToken"] ?? "mock_twilio_token";
        string fromPhone = _configuration["Twilio:FromPhone"] ?? "mock_from_phone";

        if (accountSid == "mock_twilio_sid")
        {
            _logger.LogInformation("MOCK SMS sent to {PhoneNumber}: {Message}", phoneNumber, message);
            return;
        }

        try
        {
            TwilioClient.Init(accountSid, authToken);

            var messageOptions = new CreateMessageOptions(new PhoneNumber(phoneNumber))
            {
                From = new PhoneNumber(fromPhone),
                Body = message
            };

            await MessageResource.CreateAsync(messageOptions);
        }
        catch (Exception ex)
        {
             _logger.LogError(ex, "Failed to send SMS via Twilio.");
        }
    }
}
