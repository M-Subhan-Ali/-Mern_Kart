"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { FetchSellerOrders } from "../../../redux/features/orderSlice";


const SellerOrdersPage = () => {
    const dispatch = useAppDispatch();
    const { orders, loading, error } = useAppSelector((state) => state.order);

    const [selectedItem, setSelectedItem] = useState<any>(null);

    useEffect(() => {
        dispatch(FetchSellerOrders());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="pt-[100px] px-6 max-w-6xl mx-auto text-gray-600">
                Loading orders...
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-[100px] px-6 max-w-6xl mx-auto text-red-500">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="pt-[100px] px-6 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h2>

            {orders && orders.length > 0 ? (
                <div className="space-y-8">
                    {orders.map((order: any) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
                        >
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 border-b pb-4">
                                <p className="text-sm text-gray-500 break-all">
                                    <span className="font-semibold text-gray-700">Order ID:</span>{" "}
                                    {order._id}
                                </p>
                                <span
                                    className={`inline-flex w-fit px-4 py-1 rounded-full text-sm font-medium ${order.status === "Paid"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            {/* Order Items */}
                            <div className="grid gap-4">
                                {order.orderItems.map((item: any) => (
                                    <div
                                        key={item._id}
                                        onClick={() => setSelectedItem(item)}
                                        className="flex gap-4 items-center p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-20 h-20 object-cover rounded-xl border"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 line-clamp-1">
                                                {item.title}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Qty: {item.quantity} × ${item.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <p className="text-sm text-gray-500">
                                    Placed on:{" "}
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-xl font-bold text-gray-800">
                                    Total: ${order.totalAmount}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500">
                    <p className="text-xl">You have no orders yet.</p>
                </div>
            )}

            {/* Product Detail Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl relative animate-in fade-in zoom-in">
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition"
                        >
                            ✕
                        </button>

                        <div className="p-6">
                            <img
                                src={selectedItem.image}
                                alt={selectedItem.title}
                                className="w-full h-64 object-cover rounded-xl border"
                            />

                            <h3 className="text-2xl font-bold mt-5 text-gray-800">
                                {selectedItem.title}
                            </h3>

                            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                                {selectedItem.description || "No description available."}
                            </p>

                            <div className="mt-5 flex justify-between items-center">
                                <p className="text-lg font-semibold text-gray-800">
                                    Price: ${selectedItem.price}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Quantity: {selectedItem.quantity}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerOrdersPage;
