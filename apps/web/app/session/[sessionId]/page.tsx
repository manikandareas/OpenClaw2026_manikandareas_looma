import { notFound } from "next/navigation";
import { AppNav } from "@/components/app-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent">Read-only replay</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Session {sessionId}</h1>
          </div>
          <div className="rounded-md border bg-secondary px-3 py-1 text-sm text-muted-foreground">
            Public link
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
          <Card className="min-h-[460px]">
            <CardHeader>
              <CardTitle>Replay viewport</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-80 items-center justify-center rounded-md bg-black font-mono text-sm text-muted-foreground">
                Replay renderer deferred
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-2/5 bg-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Review markers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Markers, chapters, and notes will render from replay metadata.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
