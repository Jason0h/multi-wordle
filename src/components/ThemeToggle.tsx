"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={(e) => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
        e.currentTarget.blur();
      }}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border outline-none transition-colors hover:bg-accent"
    >
      <Sun className="hidden h-4 w-4 dark:block" />
      <Moon className="h-4 w-4 dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
