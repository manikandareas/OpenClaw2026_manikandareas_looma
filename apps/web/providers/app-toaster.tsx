"use client";

import { useTheme } from "next-themes";
import { Toaster, type ToasterProps } from "sonner";

export function AppToaster() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme ?? "system") as ToasterProps["theme"];

  return <Toaster theme={theme} richColors position="top-center" />;
}
