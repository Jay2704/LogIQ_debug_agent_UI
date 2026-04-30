import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

interface ThemeContextValue {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
