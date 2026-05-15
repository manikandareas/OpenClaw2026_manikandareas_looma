"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Radio, Play } from "lucide-react";
import { ClaudeCodeSetup } from "./claude-code-setup";

type QuickActionsProps = {
  mcpServerPath: string;
  hookBridgePath: string;
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
];

export function QuickActions({ mcpServerPath, hookBridgePath }: QuickActionsProps) {
  const [setupOpen, setSetupOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-3">
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
      {setupOpen ? (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setSetupOpen(false)}>
              Close setup
            </Button>
          </div>
          <ClaudeCodeSetup mcpServerPath={mcpServerPath} hookBridgePath={hookBridgePath} />
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
    <Card className="h-full transition-colors hover:bg-muted/50">
      <CardContent className="flex items-start gap-3 p-4">
        <div className="rounded-md bg-muted p-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
