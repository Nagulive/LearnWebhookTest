"use client";

import { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";
import toast from "react-hot-toast";

interface Hall {
  id: string;
  name: string;
  ownerName: string;
  isApprovedByAdmin: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: number;
}

interface Analytics {
  totalUsers: number;
  totalHalls: number;
  totalBookings: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [unapprovedHalls, setUnapprovedHalls] = useState<Hall[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const fetchData = async () => {
    try {
        const hallsRes = await apiClient.get("/Halls/unapproved");
        setUnapprovedHalls(hallsRes.data);

        const usersRes = await apiClient.get("/Users");
        setUsers(usersRes.data);

        const analyticsRes = await apiClient.get("/Analytics");
        setAnalytics(analyticsRes.data);
    } catch {
        toast.error("Failed to load admin data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveHall = async (id: string) => {
    try {
      await apiClient.put(`/Halls/${id}/approve`);
      toast.success("Hall approved successfully!");
      fetchData();
    } catch {
      toast.error("Failed to approve hall");
    }
  };

  const getRoleName = (role: number) => {
      if (role === 2) return "Admin";
      if (role === 1) return "Owner";
      return "Customer";
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Analytics Overview */}
      {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
                  <p className="text-gray-500 text-sm font-semibold uppercase">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.totalUsers}</p>
              </div>
              <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
                  <p className="text-gray-500 text-sm font-semibold uppercase">Registered Halls</p>
                  <p className="text-3xl font-bold text-green-600">{analytics.totalHalls}</p>
              </div>
              <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
                  <p className="text-gray-500 text-sm font-semibold uppercase">Total Bookings</p>
                  <p className="text-3xl font-bold text-purple-600">{analytics.totalBookings}</p>
              </div>
              <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
                  <p className="text-gray-500 text-sm font-semibold uppercase">Total Revenue</p>
                  <p className="text-3xl font-bold text-orange-600">₹{analytics.totalRevenue}</p>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Halls Pending Approval</h2>
              {unapprovedHalls.length === 0 ? (
                <p className="text-gray-500 italic">No halls pending approval.</p>
              ) : (
                <div className="space-y-4">
                  {unapprovedHalls.map(hall => (
                    <div key={hall.id} className="border p-4 rounded bg-white shadow-sm flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">{hall.name}</p>
                        <p className="text-sm text-gray-600">Owner: {hall.ownerName}</p>
                      </div>
                      <button
                        onClick={() => approveHall(hall.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                        Approve
                      </button>
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div>
             <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Registered Users</h2>
             {users.length === 0 ? (
                 <p className="text-gray-500 italic">No users found.</p>
             ) : (
                <div className="overflow-x-auto shadow-sm rounded border">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="text-left p-3">Name</th>
                                <th className="text-left p-3">Email</th>
                                <th className="text-left p-3">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{u.name}</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${u.role === 2 ? 'bg-purple-100 text-purple-800' : u.role === 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {getRoleName(u.role)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             )}
          </div>
      </div>
    </div>
  );
}
