import Link from "next/link";
import { Play, Share2, TerminalSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const rawLog = [
  "$ bun test",
  "auth.test.ts failed: expected 401 received 500",
  "$ sed -n '1,220p' apps/api/auth.ts",
  "$ apply_patch middleware session refresh",
  "$ bun test",
  "42 passed, 0 failed"
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6">
      <nav className="flex items-center justify-between">
        <div className="text-sm font-semibold">Looma</div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/sign-up">Sign up</Link>
          </Button>
        </div>
      </nav>

      <section className="grid flex-1 items-center gap-8 py-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border bg-secondary px-3 py-1 text-xs text-muted-foreground">
            <TerminalSquare className="h-3.5 w-3.5" />
            Replay-native observability
          </div>
          <h1 className="text-5xl font-semibold tracking-normal text-balance md:text-7xl">
            Looma
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Record autonomous coding-agent sessions and turn them into shareable replay artifacts with terminal events, diffs, chapters, and review markers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/import">Import transcript</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Before</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="h-72 overflow-hidden rounded-md bg-black p-4 font-mono text-xs leading-6 text-zinc-400">
                {rawLog.concat(rawLog, rawLog).join("\n")}
              </pre>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-accent/40">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">After</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 rounded-md bg-muted p-3">
                <Play className="h-4 w-4 text-accent" />
                <div className="h-2 flex-1 rounded-full bg-secondary">
                  <div className="h-2 w-2/3 rounded-full bg-accent" />
                </div>
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {["12 reads", "5 edits", "2 reviews"].map((item) => (
                  <div key={item} className="rounded-md bg-muted p-3 text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {["Auth middleware changed", "Failed test fixed", "Env handling touched"].map((item) => (
                  <div key={item} className="rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
