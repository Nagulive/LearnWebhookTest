"use client";

import { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";
import toast from "react-hot-toast";

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
      const hallsRes = await apiClient.get("/Halls/my-halls");
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
      toast.success("Hall submitted for approval!");
      setNewHall({ name: '', description: '', capacity: 0, pricePerDay: 0, state: '', city: '', fullAddress: '' });
      fetchData(); // Refresh list
    } catch (err: unknown) {
        if (err instanceof Error && 'response' in err) {
            const errorResponse = (err as { response?: { data?: { errors?: unknown } | string } }).response?.data;
            if(errorResponse && typeof errorResponse === 'object' && errorResponse.errors) {
                setError(JSON.stringify(errorResponse.errors));
                toast.error("Validation failed. Check form.");
            } else {
                setError(typeof errorResponse === 'string' ? errorResponse : "Failed to add hall.");
                toast.error(typeof errorResponse === 'string' ? errorResponse : "Failed to add hall.");
            }
        } else {
            setError("Failed to add hall.");
            toast.error("An unexpected error occurred.");
        }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">My Halls</h2>
          <button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-600 text-white px-4 py-2 rounded mb-4 shadow hover:bg-green-700 transition">
            {showAddForm ? "Cancel" : "+ Add New Hall"}
          </button>

          {showAddForm && (
            <form onSubmit={handleAddHall} className="border p-6 mb-6 rounded-lg bg-gray-50 shadow-inner">
              <h3 className="font-semibold text-lg mb-4">Register New Hall</h3>
              {error && <div className="text-red-600 text-xs mb-4 p-2 bg-red-50 rounded overflow-auto max-h-24">{error}</div>}

              {/* Image Upload Placeholder */}
              <div className="mb-4 border-2 border-dashed border-gray-300 p-6 text-center text-gray-500 rounded bg-white cursor-pointer hover:bg-gray-100 transition">
                 <p>📷 Click to upload hall images (Coming soon to Epic 3!)</p>
              </div>

              <input type="text" placeholder="Hall Name" className="w-full mb-3 p-2 border rounded" required value={newHall.name} onChange={e => setNewHall({...newHall, name: e.target.value})} />
              <textarea placeholder="Description" className="w-full mb-3 p-2 border rounded h-24" required value={newHall.description} onChange={e => setNewHall({...newHall, description: e.target.value})} />
              <div className="flex gap-3 mb-3">
                <input type="number" placeholder="Capacity (e.g. 500)" className="w-1/2 p-2 border rounded" required value={newHall.capacity || ""} onChange={e => setNewHall({...newHall, capacity: parseInt(e.target.value) || 0})} />
                <input type="number" placeholder="Price per Day (₹)" className="w-1/2 p-2 border rounded" required value={newHall.pricePerDay || ""} onChange={e => setNewHall({...newHall, pricePerDay: parseFloat(e.target.value) || 0})} />
              </div>
              <div className="flex gap-3 mb-3">
                <input type="text" placeholder="State (e.g. Kerala)" className="w-1/2 p-2 border rounded" required value={newHall.state} onChange={e => setNewHall({...newHall, state: e.target.value})} />
                <input type="text" placeholder="City" className="w-1/2 p-2 border rounded" required value={newHall.city} onChange={e => setNewHall({...newHall, city: e.target.value})} />
              </div>
              <input type="text" placeholder="Full Address" className="w-full mb-4 p-2 border rounded" required value={newHall.fullAddress} onChange={e => setNewHall({...newHall, fullAddress: e.target.value})} />
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow hover:bg-blue-700 transition">Submit for Approval</button>
            </form>
          )}

          <ul className="space-y-4">
            {halls.length === 0 ? <p className="text-gray-500 italic">No halls found. Register one above!</p> : halls.map(h => (
              <li key={h.id} className="border p-4 rounded bg-white shadow-sm flex justify-between items-center">
                <strong className="text-lg">{h.name}</strong>
                {h.isApprovedByAdmin ?
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-200">Approved</span> :
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full border border-orange-200">Pending Approval</span>
                }
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
