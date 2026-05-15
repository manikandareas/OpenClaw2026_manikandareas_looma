"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";

export function ImportForm() {
  const router = useRouter();
  const [transcript, setTranscript] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setTranscript(text);

    if (!name) {
      setName(file.name.replace(/\.(json|jsonl)$/i, ""));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!transcript.trim()) {
      toast.error("Please paste or upload a transcript.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Imported Session",
          harness: "import",
          transcript: transcript.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Import failed");
      }

      const data = await res.json();
      toast.success(`Imported ${data.normalizedEventCount} events`);
      router.push(`/session/${data.sessionId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session Name</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="e.g. Add JWT auth with refresh token"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transcript JSON</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors hover:bg-muted/50"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Click to upload JSON/JSONL file
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.jsonl"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
          <textarea
            className="min-h-72 w-full rounded-md border bg-background p-3 font-mono text-sm"
            placeholder='Paste a JSON array of events, e.g. [{"type": "terminal_command", "payload": {...}}]'
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Import Transcript"
        )}
      </Button>
    </form>
  );
}
