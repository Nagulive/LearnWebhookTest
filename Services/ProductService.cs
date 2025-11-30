using ShoppingSite.Models;
using System.Collections.Generic;
using System.Linq;

namespace ShoppingSite.Services
{
    public class ProductService
    {
        private List<Product> _products = new()
        {
            new Product { Id = 1, Name = "Premium Wireless Headphones", Description = "Noise cancelling, 20h battery life.", Price = 299.99m, ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60", Category = "Electronics" },
            new Product { Id = 2, Name = "Smart Watch Series 7", Description = "Fitness tracker, heart rate monitor.", Price = 399.99m, ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60", Category = "Electronics" },
            new Product { Id = 3, Name = "Ergonomic Office Chair", Description = "Comfortable mesh chair for long hours.", Price = 199.99m, ImageUrl = "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&auto=format&fit=crop&q=60", Category = "Furniture" },
            new Product { Id = 4, Name = "Mechanical Keyboard", Description = "RGB backlighting, tactile switches.", Price = 129.99m, ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=500&auto=format&fit=crop&q=60", Category = "Electronics" },
            new Product { Id = 5, Name = "Leather Wallet", Description = "Genuine leather, slim design.", Price = 49.99m, ImageUrl = "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60", Category = "Accessories" },
            new Product { Id = 6, Name = "Running Shoes", Description = "Lightweight, breathable, durable.", Price = 89.99m, ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60", Category = "Fashion" }
        };

        public List<Product> GetProducts()
        {
            return _products;
        }

        public Product? GetProductById(int id)
        {
            return _products.FirstOrDefault(p => p.Id == id);
        }
    }
}
