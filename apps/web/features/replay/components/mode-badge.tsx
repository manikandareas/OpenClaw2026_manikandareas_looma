"use client";

import { Badge } from "@/components/ui/badge";
import type { ViewportMode } from "../types/replay";
import { Terminal, FileCode, GitCompare, FlaskConical, Globe } from "lucide-react";

const MODE_CONFIG: Record<ViewportMode, { label: string; icon: typeof Terminal }> = {
  terminal: { label: "Terminal", icon: Terminal },
  editor: { label: "Editor", icon: FileCode },
  diff: { label: "Diff", icon: GitCompare },
  test: { label: "Test", icon: FlaskConical },
  browser: { label: "Browser", icon: Globe },
};

export function ModeBadge({ mode }: { mode: ViewportMode }) {
  const config = MODE_CONFIG[mode];
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className="pointer-events-none gap-1.5 bg-secondary/80 backdrop-blur-sm"
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
