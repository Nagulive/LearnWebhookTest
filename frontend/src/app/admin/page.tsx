"use client";

import { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";

interface Hall {
  id: string;
  name: string;
  ownerName: string;
  isApprovedByAdmin: boolean;
}

export default function AdminDashboard() {
  const [unapprovedHalls, setUnapprovedHalls] = useState<Hall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchHalls = async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const res = await apiClient.get("/Halls/unapproved");
      setUnapprovedHalls(res.data);
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHalls(true);
  }, []);

  const approveHall = async (id: string) => {
    setApprovingId(id);
    try {
      await apiClient.put(`/Halls/${id}/approve`);
      await fetchHalls();
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <h2 className="text-2xl font-semibold mb-4">Halls Pending Approval</h2>

      {isLoading ? (
        <p className="animate-pulse text-gray-500">Loading pending halls...</p>
      ) : unapprovedHalls.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg">
          <p className="text-gray-500">No halls pending approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {unapprovedHalls.map(hall => (
            <div key={hall.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{hall.name}</p>
                <p className="text-gray-600">Owner: {hall.ownerName}</p>
              </div>
              <button
                onClick={() => approveHall(hall.id)}
                disabled={approvingId === hall.id}
                aria-busy={approvingId === hall.id}
                className={`text-white px-4 py-2 rounded focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
                  approvingId === hall.id ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                aria-label={approvingId === hall.id ? `Approving ${hall.name}...` : `Approve ${hall.name}`}
              >
                {approvingId === hall.id ? "Approving..." : "Approve"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
