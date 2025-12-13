"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const isDisabled = !user.email || !user.password || loading;

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    try {
      setLoading(true);
      const { data } = await axios.post("/api/users/login", user);
      toast.success(data.message || "Login successful");
      router.push("/profile");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center  px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6">
        <h1 className="mb-6 text-center text-2xl font-semibold text-white">
          {loading ? "Processing..." : "Login"}
        </h1>

        <form onSubmit={onLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="rounded-md border border-gray-700 bg-black px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="rounded-md border border-gray-700 bg-black px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className="mt-2 rounded-md bg-blue-600 py-2 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
