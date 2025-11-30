using ShoppingSite.Models;

namespace ShoppingSite.Services
{
    public class UserService
    {
        public User CurrentUser { get; set; } = new User
        {
            Id = 1,
            Name = "John Doe",
            Email = "john.doe@example.com",
            Address = "123 Shopping Lane, Market City"
        };
    }
}
