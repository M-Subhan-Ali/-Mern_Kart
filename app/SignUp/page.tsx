"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../../redux/hooks";
import { loginUser } from "../../redux/features/userSlice";
import axios from "axios";

const SignUpPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("buyer");

  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessDecription, setBusinessDecription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    const userData = {
      name,
      email,
      password,
      confirmPassword,
      role,
      ...(role === "seller" && {
        businessName,
        businessAddress,
        businessDecription,
        phoneNumber,
        businessPhoneNumber,
      }),
    };

    try {
      setLoading(true);

      // ✅ Step 1: Create user
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ROUTE}/authentication/signUp`,
        userData,
        { withCredentials: true }
      );

      if (!response.data?.user) {
        toast.error("Signup failed. Please try again.", {
          position: "top-center",
        });
        return;
      }

      // ✅ Step 2: Automatically log in newly registered user
      await dispatch(
        loginUser({ email, password, role })
      ).unwrap();

      toast.success("Signup successful! Redirecting...", {
        position: "top-center",
        autoClose: 1800,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("loginSuccess", "true");
      }

      // ✅ Step 3: Redirect by role
      const redirectPath =
        response.data.user.role === "seller" ? "/Seller" : "/Buyer";

      setTimeout(() => {
        router.push(redirectPath);
      }, 1500);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Something went wrong during signup.",
        { position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-600 to-gray-300 flex items-center justify-center pt-[130px] pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gradient-to-tl from-gray-300 to-blue-300 rounded-2xl shadow-xl p-8 space-y-8 transform transition-all duration-500">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Join Mern Kart
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create an account for a personalized shopping experience
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm text-gray-900 placeholder-gray-400"
              placeholder="Name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm text-gray-900 placeholder-gray-400"
              placeholder="Email"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Conditional Seller Fields */}
          {role === "seller" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 text-gray-900"
                  placeholder="Business Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Address
                </label>
                <input
                  type="text"
                  required
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 text-gray-900"
                  placeholder="Business Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Description
                </label>
                <input
                  type="text"
                  required
                  value={businessDecription}
                  onChange={(e) => setBusinessDecription(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 text-gray-900"
                  placeholder="Describe your business"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 text-gray-900"
                  placeholder="Personal Contact Number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={businessPhoneNumber}
                  onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 text-gray-900"
                  placeholder="Business Contact Number"
                />
              </div>
            </>
          )}

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 text-gray-900"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 text-gray-900"
              placeholder="••••••••"
            />
          </div>

          {/* Terms */}
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-gray-400 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <a href="#terms" className="text-gray-500 underline hover:text-gray-600">
                Terms & Conditions
              </a>
            </label>
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/Login" className="text-black font-medium transition duration-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
