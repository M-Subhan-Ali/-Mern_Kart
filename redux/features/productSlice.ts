import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API_BASE_URL } from "../../utils/apiConfig";
const BASE_URL = API_BASE_URL;

// ========================= 🧠 THUNKS =========================

// 1️⃣ Get all products (public route)
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/product`);
      return res.data; // Array of products
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch products");
    }
  }
);


// 2️⃣ Get single product by ID
export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/product/${id}`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch product");
    }
  }
);

// 3️⃣ Get seller’s own products (protected)
export const fetchSellerProducts = createAsyncThunk(
  "product/fetchSellerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/product/getsellerproducts`, {
        withCredentials: true,
      });
      return res.data.products || res.data; // Based on your backend response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch seller products");
    }
  }
);

// 4️⃣ Create product (seller only)
export const createProduct = createAsyncThunk(
  "product/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/product/create-product`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to create product");
    }
  }
);

// 5️⃣ Update product (seller only)
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/product/update-product/${id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to update product");
    }
  }
);

// 6️⃣ Delete product (seller only)
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/product/delete/${id}`, {}, { withCredentials: true });
      return { id, message: res.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete product");
    }
  }
);

// ========================= ⚙️ INITIAL STATE =========================
const initialState = {
  products: [] as any[],
  sellerProducts: [] as any[],
  singleProduct: null as any,
  loading: false,
  error: null as string | null,
  message: null as string | null,
};

// ========================= 🧩 SLICE =========================
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetSingleProduct: (state) => {
      state.singleProduct = {};     // 🧹 clear old data
    },
    resetProductError: (state) => {
      state.error = null;
    },
    resetProductMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: typeof initialState) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    };
    const rejected = (state: typeof initialState, action: any) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // Fetch all
      .addCase(fetchAllProducts.pending, pending)
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, rejected)

      // Fetch single
      .addCase(fetchProductById.pending, pending)
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, rejected)

      // Fetch seller products
      .addCase(fetchSellerProducts.pending, pending)
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerProducts = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, rejected)

      // Create product
      .addCase(createProduct.pending, pending)
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerProducts.unshift(action.payload);
        state.message = "Product created successfully";
      })
      .addCase(createProduct.rejected, rejected)

      // Update product
      .addCase(updateProduct.pending, pending)
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sellerProducts.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.sellerProducts[index] = action.payload;
        state.message = "Product updated successfully";
      })
      .addCase(updateProduct.rejected, rejected)

      // Delete product
      .addCase(deleteProduct.pending, pending)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerProducts = state.sellerProducts.filter((p) => p._id !== action.payload.id);
        state.message = action.payload.message;
      })
      .addCase(deleteProduct.rejected, rejected);
  },
});

// ========================= 🧭 EXPORTS =========================
export const { resetSingleProduct, resetProductError, resetProductMessage } = productSlice.actions;
export default productSlice.reducer;
