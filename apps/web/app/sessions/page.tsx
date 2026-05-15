import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>No sessions yet</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Start with the MCP server or import a transcript to populate this list.
          </CardContent>
        </Card>
      </main>
    </>
  );
}
