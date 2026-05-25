"use client";

import { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";

interface Hall {
  id: string;
  name: string;
  isApprovedByAdmin: boolean;
}

interface Booking {
  id: string;
  hallName: string;
  customerName: string;
  eventDate: string;
}

export default function OwnerDashboard() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // In a real app, you would fetch only halls owned by this user
    apiClient.get("/Halls").then(res => setHalls(res.data));
    apiClient.get("/Bookings/my-bookings").then(res => setBookings(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Halls</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2">
            + Add New Hall
          </button>
          <ul className="space-y-4">
            {halls.map(h => (
              <li key={h.id} className="border p-4 rounded">
                <strong>{h.name}</strong> - {h.isApprovedByAdmin ? 'Approved' : 'Pending Approval'}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Bookings</h2>
          <ul className="space-y-4">
            {bookings.map(b => (
              <li key={b.id} className="border p-4 rounded">
                <strong>{b.hallName}</strong> booked by {b.customerName} on {new Date(b.eventDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
