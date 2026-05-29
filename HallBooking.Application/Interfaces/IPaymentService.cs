namespace HallBooking.Application.Interfaces;

public interface IPaymentService
{
    Task<string> CreatePaymentOrderAsync(decimal amount, string currency, string receiptId);
    Task<bool> VerifyPaymentSignatureAsync(string orderId, string paymentId, string signature);
}
