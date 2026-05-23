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

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await apiClient.get("/Halls");
        setHalls(response.data);
      } catch (error) {
        console.error("Failed to fetch halls", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  return (
    <main className="p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Kerala & Tamil Nadu Hall Bookings</h1>
        <p className="text-gray-600">Find the perfect venue for your next event.</p>
      </header>

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
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
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
