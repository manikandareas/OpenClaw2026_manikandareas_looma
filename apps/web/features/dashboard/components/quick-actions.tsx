import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Radio, Play } from "lucide-react";

const ACTIONS = [
  {
    title: "Start Recording",
    description: "Configure MCP server to record agent sessions",
    href: "/dashboard",
    icon: Radio,
  },
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

export function QuickActions() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium">Quick Actions</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {ACTIONS.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardContent className="flex items-start gap-3 p-4">
                <div className="rounded-md bg-muted p-2">
                  <action.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
