"use client";

import { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";
import toast from "react-hot-toast";

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
      try {
          await apiClient.post("/Bookings", {
              hallId: bookingModal?.id,
              eventType: 0, // Mocking "Marriage"
              eventDate: eventDate
          });
          toast.success("Booking Successful!");
          setBookingModal(null);
      } catch {
          toast.error("Booking failed. Ensure you are logged in as a Customer.");
      }
  };

  return (
    <main className="p-8 font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Kerala & Tamil Nadu Hall Bookings</h1>
        <p className="text-lg text-gray-600 mb-8">Discover and book the perfect venue for your next event.</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
            <input type="text" placeholder="State (e.g. Kerala, Tamil Nadu)" value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="border-2 border-gray-300 p-3 rounded-lg flex-1 shadow-sm focus:border-blue-500 focus:outline-none transition" />
            <input type="text" placeholder="City" value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="border-2 border-gray-300 p-3 rounded-lg flex-1 shadow-sm focus:border-blue-500 focus:outline-none transition" />
            <button onClick={fetchHalls} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">Search Venues</button>
        </div>
      </header>

      {bookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <form onSubmit={handleBooking} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Book {bookingModal.name}</h2>
                <p className="text-gray-500 mb-6">{bookingModal.city}, {bookingModal.state}</p>

                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                   <p className="font-semibold text-lg text-blue-900">Total Price: ₹{bookingModal.pricePerDay} <span className="text-sm font-normal">/ day</span></p>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">Select Event Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]} // Prevents booking past dates
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg mb-8 focus:border-blue-500 focus:outline-none"
                />

                <div className="flex gap-4">
                    <button type="button" onClick={() => setBookingModal(null)} className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold p-3 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                    <button type="submit" className="flex-1 bg-blue-600 text-white font-semibold p-3 rounded-lg shadow hover:bg-blue-700 transition">Confirm Payment</button>
                </div>
            </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {halls.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
               <p className="text-xl text-gray-500 font-medium">No halls available matching your search.</p>
               <p className="text-gray-400 mt-2">Try adjusting your filters or checking back later.</p>
            </div>
          ) : (
            halls.map((hall) => (
              <div key={hall.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col">
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                   <p>📷 Image Gallery (Epic 3)</p>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{hall.name}</h2>
                  <p className="text-sm text-gray-500 mb-4 font-medium tracking-wide uppercase">{hall.city}, {hall.state} • By {hall.ownerName}</p>
                  <p className="text-gray-600 mb-6 flex-1 line-clamp-3">{hall.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="font-extrabold text-xl text-blue-700">₹{hall.pricePerDay} <span className="text-sm text-gray-500 font-normal">/ day</span></p>
                    <button onClick={() => setBookingModal(hall)} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
