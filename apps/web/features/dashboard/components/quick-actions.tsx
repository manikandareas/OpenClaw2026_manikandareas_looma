"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, ChevronRight, FileText, Play, Radio } from "lucide-react";
import { ClaudeCodeSetup } from "./claude-code-setup";

type QuickActionsProps = {
  appUrl: string;
};

const LINK_ACTIONS = [
  {
    title: "Import Transcript",
    description: "Upload a JSON/JSONL agent transcript",
    href: "/import",
    icon: FileText,
  },
  {
    title: "View Demo",
    description: "See a sample replay session in action",
    href: "/session/demo",
    icon: Play,
  },
  {
    title: "Read Docs",
    description: "Set up recording and replay review",
    href: "/docs",
    icon: BookOpen,
  },
];

export function QuickActions({ appUrl }: QuickActionsProps) {
  const [setupOpen, setSetupOpen] = useState(false);

  return (
    <div className="flex flex-col rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-sm font-medium">Quick Actions</h2>
      </div>

      <div className="px-5 pb-5">
        <div className="grid gap-2">
          <button
            type="button"
            className="text-left"
            onClick={() => setSetupOpen((open) => !open)}
            aria-expanded={setupOpen}
          >
            <ActionCard
              title="Start Recording"
              description="Configure Claude Code MCP and hooks"
              icon={Radio}
            />
          </button>
          {LINK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <ActionCard
                title={action.title}
                description={action.description}
                icon={action.icon}
              />
            </Link>
          ))}
        </div>
      </div>

      {setupOpen ? (
        <div className="border-t bg-muted/20 p-5">
          <div className="mb-3 flex justify-end">
            <button
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setSetupOpen(false)}
            >
              Close setup
            </button>
          </div>
          <ClaudeCodeSetup appUrl={appUrl} />
        </div>
      ) : null}
    </div>
  );
}

function ActionCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Radio;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
    </div>
  );
}
