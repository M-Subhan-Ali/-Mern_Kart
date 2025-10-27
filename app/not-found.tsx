"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 text-center">
      <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-100 mb-4">
        404
      </h1>

      <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition duration-200"
        >
          Go Back
        </button>

        <Link
          href="/"
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg text-white transition duration-200"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
