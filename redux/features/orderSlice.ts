import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/utils/apiConfig";
import { getMyOrders } from "@/api/order";

const BASE_URL = API_BASE_URL;

export const FetchMyOrders = createAsyncThunk<any[], void, { rejectValue: string }>(
    "orders/fetchMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            return await getMyOrders();

        } catch (error: any) {
            return rejectWithValue(`Failed to fetch orders, ${error.response.data.message}`)
        }
    }
)

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
                state.orders = action.payload;
            })
            .addCase(FetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An unknown error occurred at orderSlice redux";
            })
    }
})

export default orderSlice.reducer;