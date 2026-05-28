"use client";

import { useEffect, useState, useMemo } from "react";
import apiClient from "../lib/apiClient";
import toast from "react-hot-toast";
import { loadScript } from "../lib/loadScript";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

interface Hall {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  city: string;
  state: string;
  ownerName: string;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Booking state
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [latFilter, setLatFilter] = useState("");
  const [lngFilter, setLngFilter] = useState("");
  const [radiusFilter, setRadiusFilter] = useState("10"); // Default 10km

  const [bookingModal, setBookingModal] = useState<Hall | null>(null);
  const [eventDate, setEventDate] = useState("");

  const { isLoaded: isMapLoaded } = useLoadScript({
      googleMapsApiKey: "mock_google_maps_api_key_replace_me_in_env",
  });

  const mapCenter = useMemo(() => {
     if (latFilter && lngFilter) return { lat: parseFloat(latFilter), lng: parseFloat(lngFilter) };
     if (halls.length > 0) return { lat: halls[0].latitude, lng: halls[0].longitude };
     return { lat: 10.8505, lng: 76.2711 }; // Default to Kerala Center
  }, [latFilter, lngFilter, halls]);

  const fetchHalls = async () => {
    setLoading(true);
    try {
      let query = "/Halls?";
      if (stateFilter) query += `state=${stateFilter}&`;
      if (cityFilter) query += `city=${cityFilter}&`;
      if (latFilter && lngFilter && radiusFilter) {
          query += `lat=${latFilter}&lng=${lngFilter}&radiusKm=${radiusFilter}`;
      }

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

      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          return;
      }

      try {
          // 1. Create order on our backend
          const bookingResponse = await apiClient.post("/Bookings", {
              hallId: bookingModal?.id,
              eventType: 0, // Mocking "Marriage"
              eventDate: eventDate
          });

          const bookingData = bookingResponse.data;

          // 2. Setup Razorpay options
          const options = {
              key: "mock_key_id", // In real app, this would be env variable NEXT_PUBLIC_RAZORPAY_KEY
              amount: bookingModal!.pricePerDay * 100,
              currency: "INR",
              name: "Hall Booking Platform",
              description: `Booking for ${bookingModal!.name}`,
              order_id: bookingData.paymentTransactionId,
              handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
                  // 3. Verify payment signature on backend
                  try {
                      await apiClient.post(`/Bookings/${bookingData.id}/verify-payment`, {
                          razorpayPaymentId: response.razorpay_payment_id,
                          razorpayOrderId: response.razorpay_order_id,
                          razorpaySignature: response.razorpay_signature
                      });
                      toast.success("Payment Verified & Booking Confirmed!");
                      setBookingModal(null);
                  } catch {
                      toast.error("Payment Verification Failed.");
                  }
              },
              prefill: {
                  name: "Customer Name",
                  email: "customer@example.com",
                  contact: "9999999999"
              },
              theme: { color: "#2563eb" }
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const paymentObject = new (window as any).Razorpay(options);
          paymentObject.open();

      } catch {
          toast.error("Failed to initialize booking. Ensure you are logged in as a Customer.");
      }
  };

  return (
    <main className="p-8 font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Kerala & Tamil Nadu Hall Bookings</h1>
        <p className="text-lg text-gray-600 mb-8">Discover and book the perfect venue for your next event.</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-3xl mx-auto mb-4">
            <input type="text" placeholder="State (e.g. Kerala, Tamil Nadu)" value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="border-2 border-gray-300 p-3 rounded-lg flex-1 shadow-sm focus:border-blue-500 focus:outline-none transition" />
            <input type="text" placeholder="City" value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="border-2 border-gray-300 p-3 rounded-lg flex-1 shadow-sm focus:border-blue-500 focus:outline-none transition" />
            <button onClick={fetchHalls} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">Search Text</button>
        </div>

        <div className="text-sm font-semibold text-gray-500 mb-2">— OR SEARCH BY RADIUS —</div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-3xl mx-auto mb-8">
            <input type="number" placeholder="Lat (e.g. 10.85)" value={latFilter} onChange={e => setLatFilter(e.target.value)} className="border-2 border-gray-300 p-3 rounded-lg flex-1 shadow-sm focus:border-blue-500 focus:outline-none transition" />
            <input type="number" placeholder="Lng (e.g. 76.27)" value={lngFilter} onChange={e => setLngFilter(e.target.value)} className="border-2 border-gray-300 p-3 rounded-lg flex-1 shadow-sm focus:border-blue-500 focus:outline-none transition" />
            <input type="number" placeholder="Radius (km)" value={radiusFilter} onChange={e => setRadiusFilter(e.target.value)} className="border-2 border-gray-300 p-3 rounded-lg flex-1 shadow-sm focus:border-blue-500 focus:outline-none transition" />
            <button onClick={fetchHalls} className="bg-green-600 text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-green-700 transition">Search Map</button>
        </div>
      </header>

      {/* Map View Placeholder */}
      <div className="max-w-7xl mx-auto mb-12 h-96 bg-gray-200 border border-gray-300 overflow-hidden flex items-center justify-center rounded-xl shadow-inner relative">
         {!isMapLoaded ? (
             <p className="text-gray-500 text-lg font-medium animate-pulse">Loading Map...</p>
         ) : (
             <>
                 <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-70 z-10 flex items-center justify-center backdrop-blur-sm">
                     <p className="text-black text-xl font-bold bg-white p-4 rounded-xl shadow-xl">
                         Map requires a valid Google Maps API Key to render tiles.<br/><span className="text-sm font-normal">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in environment.</span>
                     </p>
                 </div>
                 <GoogleMap
                    zoom={latFilter ? 12 : 7}
                    center={mapCenter}
                    mapContainerClassName="w-full h-full"
                 >
                    {halls.map((hall) => (
                        <Marker
                            key={hall.id}
                            position={{lat: hall.latitude, lng: hall.longitude}}
                            label={hall.name}
                        />
                    ))}
                 </GoogleMap>
             </>
         )}
      </div>

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
