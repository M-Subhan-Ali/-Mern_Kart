"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

// ✅ This component wraps your entire app with Redux
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
