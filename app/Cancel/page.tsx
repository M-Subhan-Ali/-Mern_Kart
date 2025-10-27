"use client";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Payment Cancelled ❌
      </h1>
      <p className="text-gray-600 mb-6">Your payment was cancelled.</p>
      <Link
        href="/Cart"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 text-white font-medium hover:from-gray-600 hover:to-gray-800 transition-all duration-300 shadow-md"
      >
        Back to Cart
      </Link>
    </div>
  );
}
