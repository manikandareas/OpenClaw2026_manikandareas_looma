"use client";

import { SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      <SunMoon className="h-4 w-4" />
    </Button>
  );
}
