import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="pt-[100px] px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#378C92]">
        Seller Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manage Products */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold mb-2">Your Products</h2>
          <p className="text-gray-600 mb-4">
            View, edit, or delete the products you listed.
          </p>
          <Link
            href="/Products"
            className="inline-block px-4 py-2 bg-[#378C92] text-white rounded hover:bg-[#2c6d70]"
          >
            Manage Products
          </Link>
        </div>

        {/* Add Product */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
          <p className="text-gray-600 mb-4">
            List a new item for sale on the platform.
          </p>
          <Link
            href="/Products/create"
            className="inline-block px-4 py-2 bg-[#378C92] text-white rounded hover:bg-[#2c6d70]"
          >
            Add Product
          </Link>
        </div>

        {/* View Orders */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold mb-2">Orders Received</h2>
          <p className="text-gray-600 mb-4">
            Check orders placed for your products.
          </p>
          <Link
            href="/seller/orders"
            className="inline-block px-4 py-2 bg-[#378C92] text-white rounded hover:bg-[#2c6d70]"
          >
            View Orders
          </Link>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <p className="text-gray-600 mb-4">
            Track delivered, cancelled, and pending orders.
          </p>
          <Link
            href="/seller/summary"
            className="inline-block px-4 py-2 bg-[#378C92] text-white rounded hover:bg-[#2c6d70]"
          >
            View Summary
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
