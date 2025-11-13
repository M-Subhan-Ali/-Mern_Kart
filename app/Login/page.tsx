"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../../redux/hooks";
import { loginUser } from "../../redux/features/userSlice";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("buyer");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    if (!email || !password) {
      toast.warning("Please enter both email and password.", {
        position: "top-center",
        autoClose: 2500,
      });
      return;
    }

    setLoading(true);

    try {
      const user = await dispatch(loginUser({ email, password, role })).unwrap();

      toast.success("Login successful! Redirecting...", {
        position: "top-center",
        autoClose: 1800,
      });

      // Save success flag 
      if (typeof window !== "undefined") {
        localStorage.setItem("loginSuccess", "true");
      }

      // Redirect based on user role
      setTimeout(() => {
        router.push(user.role === "seller" ? "/Seller" : "/Buyer");
      }, 1500);
    } catch (err: any) {
      toast.error(err || "Invalid email or password.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-300 flex items-center justify-center pt-[70px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gradient-to-tl from-white to-blue-300 rounded-2xl shadow-xl p-8 space-y-8 transform transition-all duration-500">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back to Mern Kart
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your personalized shopping experience
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          autoComplete="on"
        >
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm text-gray-900 placeholder-gray-400"
              placeholder="Email"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Select Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 transition duration-300"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/SignUp" className="text-black font-medium transition duration-300">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
