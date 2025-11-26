import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../utils/apiConfig";

// === Async Thunks ===

// 🧠 1️⃣ Fetch user info
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/user/getUserInfo`,
        { withCredentials: true }
      );
      return res.data.user;
    } catch (error: any) {
      if (error.response?.status === 401)
        return rejectWithValue("Not logged in");
      return rejectWithValue(error.message);
    }
  }
);

// 🔐 2️⃣ Login user
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    {
      email,
      password,
      role,
    }: { email: string; password: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/authentication/Login`,
        { email, password, role },
        { withCredentials: true }
      );

      return res.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.error || "Invalid credentials"
      );
    }
  }
);

// 🚪 3️⃣ Logout user
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_BASE_URL}/authentication/logout`,
        {},
        { withCredentials: true }
      );
      return true;
    } catch (error: any) {
      return rejectWithValue("Logout failed");
    }
  }
);


export const userCheckLogin = createAsyncThunk("user/verify", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/user/userInfo`,
      { withCredentials: true }
    );
    return res.data.user
  } catch (error: any) {
    return rejectWithValue("Logout failed");
  }
})

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserState {
  user: User | null;
  role: string | null;
  login: boolean;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// === Initial State ===
const initialState: UserState = {
  user: null,
  role: null,
  login: false,
  loading: false,
  error: null as string | null,
  isAuthenticated: false,
};

// === Slice ===
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // === Fetch User Info ===
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload?.role || null;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.role = null;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // === Login User ===
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.login = true;
        state.user = action.payload;
        state.role = action.payload?.role || null;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.login = false;
        state.error = action.payload as string;
      });

    // === Logout User ===
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.login = false;
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.login = true;
        state.error = action.payload as string;
      });

    //check login
    builder
      .addCase(userCheckLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userCheckLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.login = true;
        state.user = action.payload;
        state.role = action.payload?.role || null;
        state.isAuthenticated = true;
      })
      .addCase(userCheckLogin.rejected, (state, action) => {
        state.loading = false;
        state.login = false;
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;
