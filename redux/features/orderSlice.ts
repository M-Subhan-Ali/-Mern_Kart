import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/utils/apiConfig";
import { getMyOrders, getSellerOrders } from "@/api/order";

const BASE_URL = API_BASE_URL;

export const FetchMyOrders = createAsyncThunk<{ orders: any[] }, void, { rejectValue: string }>(
    "orders/fetchMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            return await getMyOrders();

        } catch (error: any) {
            return rejectWithValue(`Failed to fetch orders, ${error.response.data.message}`)
        }
    }
)
export const FetchSellerOrders = createAsyncThunk<
    { orders: any[] },
    void,
    { rejectValue: string }
>(
    "orders/fetchSellerOrders",
    async (_, { rejectWithValue }) => {
        try {
            return await getSellerOrders();
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch seller orders"
            );
        }
    }
);

const initialState = {
    orders: [] as any[],
    loading: false,
    error: null as string | null
};


const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchMyOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(FetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An unknown error occurred at orderSlice redux";
            })
            .addCase(FetchSellerOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchSellerOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(FetchSellerOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An unknown error occurred at orderSlice redux";
            })
    }
})

export default orderSlice.reducer;