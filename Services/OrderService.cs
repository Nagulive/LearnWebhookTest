using ShoppingSite.Models;
using System;
using System.Collections.Generic;

namespace ShoppingSite.Services
{
    public class OrderService
    {
        private List<Order> _orders = new();

        public void PlaceOrder(Order order)
        {
            order.Id = _orders.Count + 1;
            order.OrderDate = DateTime.Now;
            _orders.Add(order);
        }

        public List<Order> GetOrders()
        {
            return _orders;
        }
    }
}
