"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
const page = () => {
  return (
    <div className="pt-[100px] px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#378C92]">
        Buyer Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Browse Products */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold mb-2">Browse Products</h2>
          <p className="text-gray-600 mb-4">
            Explore products listed by sellers and make purchases.
          </p>
          <Link
            href="/Products"
            className="inline-block px-4 py-2 bg-[#378C92] text-white rounded hover:bg-[#2c6d70]"
          >
            View Products
          </Link>
        </div>

         <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold mb-2">Browse Products</h2>
          <p className="text-gray-600 mb-4">
            View Your added items to your cart.
          </p>
          <Link
            href="/Cart"
            className="inline-block px-4 py-2 bg-[#378C92] text-white rounded hover:bg-[#2c6d70]"
          >
            View Cart
          </Link>
        </div>

        {/* View Orders */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold mb-2">Your Orders</h2>
          <p className="text-gray-600 mb-4">
            Check status of all your placed orders.
          </p>
          <Link
            href="/buyer/orders"
            className="inline-block px-4 py-2 bg-[#378C92] text-white rounded hover:bg-[#2c6d70]"
          >
            View Orders
          </Link>
        </div>

        {/* Cancelled & Delivered */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold mb-2">Order History</h2>
          <p className="text-gray-600 mb-4">
            Review your delivered and cancelled orders.
          </p>
          <Link
            href="/buyer/history"
            className="inline-block px-4 py-2 bg-[#378C92] text-white rounded hover:bg-[#2c6d70]"
          >
            View History
          </Link>
        </div>

        {/* Optional: Account Info */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold mb-2">Account Info</h2>
          <p className="text-gray-600 mb-4">
            View or update your profile information.
          </p>
          <Link
            href="/buyer/account"
            className="inline-block px-4 py-2 bg-[#378C92] text-white rounded hover:bg-[#2c6d70]"
          >
            Manage Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
