import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_ROUTE,
    withCredentials: true
})

export default axiosInstance;