"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../../lib/apiClient";
import { useAuthStore } from "../../store/authStore";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("0"); // Default: Customer (0)
  const [error, setError] = useState("");

  const { login } = useAuthStore();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiClient.post("/Auth/register", {
          name, email, password, phoneNumber, role: parseInt(role)
      });
      const { token } = response.data;

      login(token, name, email, role);

      if (parseInt(role) === 2) router.push("/admin");
      else if (parseInt(role) === 1) router.push("/owner");
      else router.push("/");

    } catch (err: unknown) {
        if (err instanceof Error && 'response' in err) {
            const errorResponse = (err as { response?: { data?: { errors?: unknown } | string } }).response?.data;
            if(errorResponse && typeof errorResponse === 'object' && errorResponse.errors) {
                setError(JSON.stringify(errorResponse.errors));
            } else {
                setError(typeof errorResponse === 'string' ? errorResponse : "Registration failed.");
            }
        } else {
            setError("Registration failed.");
        }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-xs overflow-auto">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full border p-2 rounded text-black" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full border p-2 rounded text-black" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input type="text" className="w-full border p-2 rounded text-black" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="w-full border p-2 rounded text-black" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Account Type</label>
          <select className="w-full border p-2 rounded text-black" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="0">Customer (Book Halls)</option>
              <option value="1">Hall Owner (List Halls)</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Create Account
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
}
