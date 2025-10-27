"use client";

import Link from "next/link";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function SuccessPage() {
  useEffect(() => {
    toast.success("Payment Successful! 🎉");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful ✅
      </h1>
      <p className="text-gray-600 mb-6">Thank you for your purchase!</p>
      <Link
        href="/Buyer"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 text-white font-medium hover:from-gray-600 hover:to-gray-800 transition-all duration-300 shadow-md"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
