"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-text-muted transition hover:text-text-strong"
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
