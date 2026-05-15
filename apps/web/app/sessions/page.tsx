import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppNav } from "@/features/app-shell/components/app-nav";
import { SessionList } from "@/features/sessions/components/session-list";

export default function SessionsPage() {
  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-normal">Sessions</h1>
          <Button asChild variant="outline">
            <Link href="/import">Import transcript</Link>
          </Button>
        </div>
        <div className="mt-6">
          <SessionList />
        </div>
      </main>
    </>
  );
}
