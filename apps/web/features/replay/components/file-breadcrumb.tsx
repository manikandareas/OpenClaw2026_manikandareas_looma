"use client";

import { FileCode } from "lucide-react";

export function FileBreadcrumb({ file }: { file: string | null }) {
  if (!file) return null;

  const parts = file.split("/");
  const fileName = parts.pop();
  const dirPath = parts.join("/");

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <FileCode className="h-3 w-3" />
      {dirPath && <span className="opacity-60">{dirPath}/</span>}
      <span className="text-foreground">{fileName}</span>
    </div>
  );
}
