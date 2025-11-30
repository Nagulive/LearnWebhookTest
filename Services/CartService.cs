using ShoppingSite.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ShoppingSite.Services
{
    public class CartService
    {
        public List<CartItem> CartItems { get; private set; } = new();
        public event Action? OnChange;

        public void AddToCart(Product product)
        {
            var existingItem = CartItems.FirstOrDefault(i => i.Product.Id == product.Id);
            if (existingItem != null)
            {
                existingItem.Quantity++;
            }
            else
            {
                CartItems.Add(new CartItem { Product = product, Quantity = 1 });
            }
            NotifyStateChanged();
        }

        public void RemoveFromCart(Product product)
        {
            var item = CartItems.FirstOrDefault(i => i.Product.Id == product.Id);
            if (item != null)
            {
                CartItems.Remove(item);
                NotifyStateChanged();
            }
        }
        
        public void ClearCart()
        {
            CartItems.Clear();
            NotifyStateChanged();
        }

        public decimal GetTotal()
        {
            return CartItems.Sum(i => i.Product.Price * i.Quantity);
        }

        private void NotifyStateChanged() => OnChange?.Invoke();
    }
}
