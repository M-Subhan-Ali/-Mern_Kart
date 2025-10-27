"use client";

import { CookiesProvider } from "react-cookie";
import { AppThemeProvider } from "@/theme/ThemeProvider";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
import ReduxProvider from "@/redux/Provider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <CookiesProvider>
        <Navbar />
        <AppThemeProvider>
          {children}
          <ToastContainer
            theme="dark"
            position="top-center"
            autoClose={2500}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
        </AppThemeProvider>
      </CookiesProvider>
    </ReduxProvider>
  );
}
