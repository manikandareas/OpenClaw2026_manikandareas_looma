import { Suspense } from "react";
import { AppNav } from "@/features/app-shell/components/app-nav";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { RecentSessions } from "@/features/dashboard/components/recent-sessions";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { ActivityChart } from "@/features/dashboard/components/activity-chart";
import { DashboardControls } from "@/features/dashboard/components/dashboard-controls";
import { Skeleton } from "@/components/ui/skeleton";
import { getAppUrl } from "@/lib/env";

function DashboardMainFallback() {
  return (
    <main className="py-8">
      <div className="mx-auto max-w-[1000px] space-y-8 px-4 sm:px-6">
        <Skeleton className="h-8 w-48 rounded-full" />
        <div className="flex flex-wrap gap-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-24 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="mt-12 w-full px-4 sm:px-6">
        <Skeleton className="h-[320px] w-full rounded-2xl" />
      </div>
      <div className="mx-auto mt-12 max-w-[1000px] px-4 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </main>
  );
}

function DashboardMain({ appUrl }: { appUrl: string }) {
  return (
    <main className="py-8">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
        <DashboardControls />

        <div className="mt-8">
          <DashboardStats />
        </div>
      </div>

      <div className="mt-12 w-full px-4 sm:px-6">
        <ActivityChart />
      </div>

      <div className="mx-auto mt-12 max-w-[1000px] px-4 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          <RecentSessions />
          <QuickActions appUrl={appUrl} />
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  const appUrl = getAppUrl();

  return (
    <div className="min-h-screen bg-background pb-12">
      <AppNav />
      <Suspense fallback={<DashboardMainFallback />}>
        <DashboardMain appUrl={appUrl} />
      </Suspense>
    </div>
  );
}
