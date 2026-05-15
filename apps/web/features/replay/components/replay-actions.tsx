"use client";

import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Code2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildEmbedSnippet, buildSessionUrl } from "../utils/share";

type ReplayActionsProps = {
  sessionId: string;
  title: string;
};

export function ReplayActions({ sessionId, title }: ReplayActionsProps) {
  const origin = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return window.location.origin;
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await copyToClipboard(buildSessionUrl(sessionId, origin));
      toast.success("Replay link copied");
    } catch {
      toast.error("Could not copy link");
    }
  }, [origin, sessionId]);

  const copyEmbed = useCallback(async () => {
    try {
      await copyToClipboard(buildEmbedSnippet({ sessionId, title, origin }));
      toast.success("Embed snippet copied");
    } catch {
      toast.error("Could not copy embed");
    }
  }, [origin, sessionId, title]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={copyLink}
      >
        <Link2 className="h-3.5 w-3.5" />
        Copy link
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs"
        onClick={copyEmbed}
      >
        <Code2 className="h-3.5 w-3.5" />
        Copy embed
      </Button>
    </div>
  );
}

async function copyToClipboard(text: string) {
  if (!navigator.clipboard) {
    throw new Error("Clipboard API unavailable");
  }

  await navigator.clipboard.writeText(text);
}
