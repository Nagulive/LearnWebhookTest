"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "../../lib/apiClient";
import { useAuthStore } from "../../store/authStore";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiClient.post("/Auth/login", { email, password });
      const { token, name, role } = response.data;

      login(token, name, email, role.toString());

      if (role === 2) router.push("/admin"); // Role 2 = Admin
      else if (role === 1) router.push("/owner"); // Role 1 = HallOwner
      else router.push("/"); // Role 0 = Customer

    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
         setError((err as { response?: { data?: string } }).response?.data || "Login failed.");
      } else {
         setError("Login failed.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Sign In
        </button>

        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}
