import { notFound } from "next/navigation";
import { AppNav } from "@/features/app-shell/components/app-nav";
import { ReplayShell } from "@/features/replay/components/replay-shell";

type ReplayPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function ReplayPage({ params }: ReplayPageProps) {
  const { sessionId } = await params;

  if (!sessionId) {
    notFound();
  }

  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <ReplayShell sessionId={sessionId} />
      </main>
    </>
  );
}
