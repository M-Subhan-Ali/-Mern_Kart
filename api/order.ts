import axiosInstance from "./axios"

export const getMyOrders = async () => {
    const res = await axiosInstance.get("/order/my-orders")
    return res.data
}

export const getSellerOrders = async () => {
    const res = await axiosInstance.get("/order/seller-orders")
    return res.data
}