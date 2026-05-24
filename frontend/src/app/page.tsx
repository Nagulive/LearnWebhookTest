"use client";

import { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";

interface Hall {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  city: string;
  state: string;
  ownerName: string;
}

export default function Home() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Booking state
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [bookingModal, setBookingModal] = useState<Hall | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");

  const fetchHalls = async () => {
    setLoading(true);
    try {
      let query = "/Halls?";
      if (stateFilter) query += `state=${stateFilter}&`;
      if (cityFilter) query += `city=${cityFilter}`;

      const response = await apiClient.get(query);
      setHalls(response.data);
    } catch (error) {
      console.error("Failed to fetch halls", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
      e.preventDefault();
      setBookingMsg("Processing...");
      try {
          await apiClient.post("/Bookings", {
              hallId: bookingModal?.id,
              eventType: 0, // Mocking "Marriage"
              eventDate: eventDate
          });
          setBookingMsg("Booking Successful!");
          setTimeout(() => setBookingModal(null), 2000);
      } catch {
          setBookingMsg("Booking failed. Please login first.");
      }
  };

  return (
    <main className="p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Kerala & Tamil Nadu Hall Bookings</h1>

        <div className="flex gap-4 mb-4">
            <input type="text" placeholder="State (e.g. Kerala)" value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="border p-2 rounded" />
            <input type="text" placeholder="City" value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="border p-2 rounded" />
            <button onClick={fetchHalls} className="bg-gray-800 text-white px-4 py-2 rounded">Search</button>
        </div>
      </header>

      {bookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <form onSubmit={handleBooking} className="bg-white p-8 rounded shadow-lg w-96">
                <h2 className="text-2xl mb-4">Book {bookingModal.name}</h2>
                <p className="mb-4">Total: ₹{bookingModal.pricePerDay}</p>
                <input type="date" required value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full border p-2 mb-4" />
                <div className="flex gap-4">
                    <button type="button" onClick={() => setBookingModal(null)} className="flex-1 border p-2 rounded">Cancel</button>
                    <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Confirm Payment</button>
                </div>
                {bookingMsg && <p className="mt-4 text-center">{bookingMsg}</p>}
            </form>
        </div>
      )}

      {loading ? (
        <p>Loading venues...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.length === 0 ? (
            <p>No halls available right now.</p>
          ) : (
            halls.map((hall) => (
              <div key={hall.id} className="border p-4 rounded shadow">
                <h2 className="text-xl font-bold">{hall.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{hall.city}, {hall.state} • By {hall.ownerName}</p>
                <p className="mb-4">{hall.description}</p>
                <p className="font-semibold text-lg mb-4">₹{hall.pricePerDay} / day</p>
                <button onClick={() => setBookingModal(hall)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                  Book Now
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
