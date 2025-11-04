"use client";

import { createContext, useContext } from "react";
import { theme as defaultTheme } from "./theme";

type Theme = typeof defaultTheme;

const ThemeContext = createContext<Theme>(defaultTheme);

export const useTheme = () => useContext(ThemeContext);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
}
