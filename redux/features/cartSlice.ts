import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🌐 Base URL (ensure your .env file has this)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_ROUTE;

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/cart/fetch_cart_items`, {
        withCredentials: true,
      });
      return res.data.cart;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/cart/add_to_cart`,
        { productId, quantity },
        { withCredentials: true }
      );
      return res.data.cart;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to add to cart"
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/cart/update_item/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      return res.data.cart;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update cart item"
      );
    }
  }
);

// ❌ 4️⃣ Remove an item
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/cart/remove_item/${productId}`,
        {},
        { withCredentials: true }
      );
      return res.data.cart;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to remove item"
      );
    }
  }
);

// 🧹 5️⃣ Clear the cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/cart/clear_cart`, {}, { withCredentials: true });
      return res.data.cart;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to clear cart"
      );
    }
  }
);

// === INITIAL STATE ===
const initialState = {
  cart: { items: [] as any[] },
  loading: false,
  error: null as string | null,
};

// === SLICE ===
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartError: (state) => {
      state.error = null;
    },
    clearCartLocal:(state)=>{
      state.cart = {items:[]}
    }
  },
  extraReducers: (builder) => {
    // Generic handlers for all thunks
    const pending = (state: typeof initialState) => {
      state.loading = true;
      state.error = null;
    };
    const fulfilled = (state: typeof initialState, action: any) => {
      state.loading = false;
      state.cart = action.payload;
    };
    const rejected = (state: typeof initialState, action: any) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(fetchCart.pending, pending)
      .addCase(fetchCart.fulfilled, fulfilled)
      .addCase(fetchCart.rejected, rejected)
      .addCase(addToCart.pending, pending)
      .addCase(addToCart.fulfilled, fulfilled)
      .addCase(addToCart.rejected, rejected)
      .addCase(updateCartItem.pending, pending)
      .addCase(updateCartItem.fulfilled, fulfilled)
      .addCase(updateCartItem.rejected, rejected)
      .addCase(removeCartItem.pending, pending)
      .addCase(removeCartItem.fulfilled, fulfilled)
      .addCase(removeCartItem.rejected, rejected)
      .addCase(clearCart.pending, pending)
      .addCase(clearCart.fulfilled, fulfilled)
      .addCase(clearCart.rejected, rejected);
  },
});

export const { resetCartError,clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
