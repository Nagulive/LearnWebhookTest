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

  const fetchHalls = () => {
    apiClient.get("/Halls/unapproved").then(res => setUnapprovedHalls(res.data));
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  const approveHall = async (id: string) => {
    await apiClient.put(`/Halls/${id}/approve`);
    fetchHalls();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <h2 className="text-2xl font-semibold mb-4">Halls Pending Approval</h2>

      {unapprovedHalls.length === 0 ? (
        <p>No halls pending approval.</p>
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
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
