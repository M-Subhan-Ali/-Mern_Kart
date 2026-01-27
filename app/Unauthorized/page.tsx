"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">
                    Access Denied
                </h1>

                <p className="text-gray-600 mb-6">
                    You do not have permission to access this page.
                </p>

                <div className="flex justify-center gap-4">
                    <Link
                        href="/"
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        Go Home
                    </Link>

                    <Link
                        href="/Login"
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
