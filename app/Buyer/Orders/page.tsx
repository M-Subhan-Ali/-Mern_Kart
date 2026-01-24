"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { FetchMyOrders } from "@/redux/features/orderSlice";

const OrdersPage = () => {
    const dispatch = useAppDispatch();
    const { orders, loading } = useAppSelector((state) => state.order)

    useEffect(() => {
        dispatch(FetchMyOrders())
    }, [])

    if (loading) {
        return <div className="pt-[100px] px-6 max-w-5xl mx-auto">Loading...</div>
    }

    return (<div className="pt-[100px] px-6 max-w-5xl mx-auto">

        <h2>My Orders</h2>

        {orders.map((order: any) => (
            <div key={order._id}>
                <p>Total: {order.totalAmount}</p>
                <p>Status: {order.status}</p>
            </div>
        ))}

    </div>)
}

export default OrdersPage