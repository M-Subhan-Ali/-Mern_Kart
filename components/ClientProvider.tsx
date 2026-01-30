"use client";

import { CookiesProvider } from "react-cookie";
import { AppThemeProvider } from "../theme/ThemeProvider";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
import ReduxProvider from "../redux/Provider";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Check for updates every time the app is focused
          window.addEventListener("focus", () => {
            registration.update();
          });

          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  toast.info("Update available! Reloading to apply...", {
                    onClose: () => window.location.reload(),
                    autoClose: 3000,
                  });
                  setTimeout(() => {
                    window.location.reload();
                  }, 3500);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

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
