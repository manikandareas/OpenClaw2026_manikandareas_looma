import { resolve } from "node:path";
import Link from "next/link";
import { Import } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppNav } from "@/features/app-shell/components/app-nav";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { RecentSessions } from "@/features/dashboard/components/recent-sessions";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { ActivityChart } from "@/features/dashboard/components/activity-chart";

export default function DashboardPage() {
  const workspaceRoot = process.cwd().endsWith("apps/web")
    ? resolve(process.cwd(), "../..")
    : process.cwd();
  const mcpServerPath = resolve(workspaceRoot, "packages/mcp-server/src/index.ts");
  const hookBridgePath = resolve(workspaceRoot, "packages/hook-bridge/dist/index.js");

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Recent sessions, activity, and recording entry points.
            </p>
          </div>
          <Button asChild>
            <Link href="/import">
              <Import className="h-4 w-4" /> Import
            </Link>
          </Button>
        </div>
        <div className="mt-8">
          <DashboardStats />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <RecentSessions />
          <ActivityChart />
        </div>
        <div className="mt-8">
          <QuickActions mcpServerPath={mcpServerPath} hookBridgePath={hookBridgePath} />
        </div>
      </main>
    </>
  );
}
