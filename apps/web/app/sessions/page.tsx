import { AppNav } from "@/features/app-shell/components/app-nav";
import { SessionList } from "@/features/sessions/components/session-list";

export default function SessionsPage() {
  return (
    <div className="min-h-screen bg-background pb-12">
      <AppNav />
      <main className="py-12">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h1 className="text-xl font-medium text-foreground">Sessions</h1>
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              Review your recorded agent sessions
            </p>
          </div>
          <div className="mt-8">
            <SessionList />
          </div>
        </div>
      </main>
    </div>
  );
}
