using HallBooking.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Razorpay.Api;

namespace HallBooking.Infrastructure.Services;

public class RazorpayPaymentService : IPaymentService
{
    private readonly IConfiguration _configuration;

    public RazorpayPaymentService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Task<string> CreatePaymentOrderAsync(decimal amount, string currency, string receiptId)
    {
        string key = _configuration["Razorpay:KeyId"] ?? "mock_key_id";
        string secret = _configuration["Razorpay:KeySecret"] ?? "mock_key_secret";

        // MOCK fallback for local testing without real keys
        if (key == "mock_key_id")
        {
            return Task.FromResult($"mock_order_{Guid.NewGuid().ToString("N").Substring(0, 8)}");
        }

        try
        {
            RazorpayClient client = new RazorpayClient(key, secret);

            Dictionary<string, object> options = new Dictionary<string, object>
            {
                { "amount", amount * 100 }, // Amount must be in subunits (paise for INR)
                { "currency", currency },
                { "receipt", receiptId }
            };

            Order order = client.Order.Create(options);
            return Task.FromResult(order["id"].ToString());
        }
        catch (Exception ex)
        {
            // Log exception here
            throw new InvalidOperationException("Failed to generate Razorpay order.", ex);
        }
    }

    public Task<bool> VerifyPaymentSignatureAsync(string orderId, string paymentId, string signature)
    {
        string secret = _configuration["Razorpay:KeySecret"] ?? "mock_key_secret";

        // MOCK fallback
        if (secret == "mock_key_secret")
        {
            return Task.FromResult(true);
        }

        try
        {
            Dictionary<string, string> attributes = new Dictionary<string, string>
            {
                { "razorpay_order_id", orderId },
                { "razorpay_payment_id", paymentId },
                { "razorpay_signature", signature }
            };

            Utils.verifyPaymentSignature(attributes);
            return Task.FromResult(true);
        }
        catch
        {
            return Task.FromResult(false);
        }
    }
}
