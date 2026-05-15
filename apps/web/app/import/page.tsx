import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppNav } from "@/features/app-shell/components/app-nav";

export default function ImportPage() {
  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-semibold tracking-normal">Import transcript</h1>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Transcript JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea className="min-h-72 w-full rounded-md border bg-background p-3 font-mono text-sm" placeholder="Paste a transcript here." />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
