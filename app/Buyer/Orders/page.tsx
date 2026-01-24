"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { FetchMyOrders } from "@/redux/features/orderSlice";

const OrdersPage = () => {
    const dispatch = useAppDispatch();
    const { orders, loading, error } = useAppSelector((state) => state.order)
    console.log("orderss", orders)

    useEffect(() => {
        dispatch(FetchMyOrders())
    }, [dispatch])

    if (loading) {
        return <div className="pt-[100px] px-6 max-w-5xl mx-auto">Loading...</div>
    }

    if (error) {
        return <div className="pt-[100px] px-6 max-w-5xl mx-auto text-red-500">Error: {error}</div>
    }

    return (<div className="pt-[100px] px-6 max-w-5xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">My Orders</h2>

        {orders && orders.length > 0 ? (
            <div className="space-y-6">
                {orders.map((order: any) => (
                    <div key={order._id} className="border p-4 rounded-lg shadow-sm bg-white">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <p className="font-semibold text-gray-600">Order ID: {order._id}</p>
                            <p className={`px-3 py-1 rounded-full text-sm ${order.status === "Paid" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                {order.status}
                            </p>
                        </div>
                        <div className="space-y-3">
                            {order.orderItems.map((item: any) => (
                                <div key={item._id} className="flex gap-4 items-center">
                                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                                    <div className="flex-1">
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-2 border-t flex justify-between items-center">
                            <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p className="text-lg font-bold">Total: ${order.totalAmount}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-10 text-gray-500">
                <p className="text-xl">You have no orders yet.</p>
            </div>
        )}

    </div>)
}

export default OrdersPage