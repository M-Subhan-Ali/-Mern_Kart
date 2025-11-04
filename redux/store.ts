import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "./features/userSlice";
import cartReducer from "./features/cartSlice"
import productReducer from "./features/productSlice"
export const store = configureStore({
  reducer: {
    user: userReducer ,
    cart:cartReducer,
    product:productReducer
  },
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
