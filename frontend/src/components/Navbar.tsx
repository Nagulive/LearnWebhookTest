"use client";

import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isHydrated, token, name, role, logout } = useAuthStore();
  const router = useRouter();

  if (!isHydrated) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Hallbooking</Link>
        <div className="flex gap-4 items-center">
          <Link href="/" className="hover:underline">Home</Link>

          {token ? (
            <>
              {role === "2" && <Link href="/admin" className="hover:underline">Admin Dashboard</Link>}
              {role === "1" && <Link href="/owner" className="hover:underline">Owner Dashboard</Link>}

              <span className="ml-4 font-semibold">Hi, {name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="bg-white text-blue-600 px-3 py-1 rounded font-bold hover:bg-gray-100 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
