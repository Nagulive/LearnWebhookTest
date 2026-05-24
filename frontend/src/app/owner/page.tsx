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

  // Add Hall Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHall, setNewHall] = useState({ name: '', description: '', capacity: 0, pricePerDay: 0, state: '', city: '', fullAddress: '' });
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const hallsRes = await apiClient.get("/Halls");
      // MOCK filtering locally to simulate owner view since backend auth handles it partly
      setHalls(hallsRes.data);
      const bookingsRes = await apiClient.get("/Bookings/my-bookings");
      setBookings(bookingsRes.data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddHall = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await apiClient.post("/Halls", newHall);
      setShowAddForm(false);
      fetchData(); // Refresh list
    } catch (err: unknown) {
        if (err instanceof Error && 'response' in err) {
            const errorResponse = (err as { response?: { data?: { errors?: unknown } | string } }).response?.data;
            if(errorResponse && typeof errorResponse === 'object' && errorResponse.errors) {
                setError(JSON.stringify(errorResponse.errors));
            } else {
                setError(typeof errorResponse === 'string' ? errorResponse : "Failed to add hall.");
            }
        } else {
            setError("Failed to add hall.");
        }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Halls</h2>
          <button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-600 text-white px-4 py-2 rounded mb-4">
            {showAddForm ? "Cancel" : "+ Add New Hall"}
          </button>

          {showAddForm && (
            <form onSubmit={handleAddHall} className="border p-4 mb-4 rounded bg-gray-50">
              {error && <div className="text-red-600 text-xs mb-2 overflow-auto max-h-24">{error}</div>}
              <input type="text" placeholder="Name" className="w-full mb-2 p-2 border" required onChange={e => setNewHall({...newHall, name: e.target.value})} />
              <textarea placeholder="Description" className="w-full mb-2 p-2 border" required onChange={e => setNewHall({...newHall, description: e.target.value})} />
              <div className="flex gap-2 mb-2">
                <input type="number" placeholder="Capacity" className="w-1/2 p-2 border" required onChange={e => setNewHall({...newHall, capacity: parseInt(e.target.value)})} />
                <input type="number" placeholder="Price/Day" className="w-1/2 p-2 border" required onChange={e => setNewHall({...newHall, pricePerDay: parseFloat(e.target.value)})} />
              </div>
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="State (e.g. Kerala)" className="w-1/2 p-2 border" required onChange={e => setNewHall({...newHall, state: e.target.value})} />
                <input type="text" placeholder="City" className="w-1/2 p-2 border" required onChange={e => setNewHall({...newHall, city: e.target.value})} />
              </div>
              <input type="text" placeholder="Full Address" className="w-full mb-2 p-2 border" required onChange={e => setNewHall({...newHall, fullAddress: e.target.value})} />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit for Approval</button>
            </form>
          )}

          <ul className="space-y-4">
            {halls.length === 0 ? <p>No halls found.</p> : halls.map(h => (
              <li key={h.id} className="border p-4 rounded bg-white">
                <strong>{h.name}</strong> - {h.isApprovedByAdmin ? <span className="text-green-600">Approved</span> : <span className="text-orange-500">Pending Approval</span>}
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
