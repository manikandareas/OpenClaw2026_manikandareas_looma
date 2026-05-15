import { FileText, Radio } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SessionsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <div className="rounded-full bg-muted p-3">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-medium">No sessions yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Start recording an agent session via MCP or import an existing transcript.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/import">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Import Transcript
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/dashboard">
            <Radio className="mr-1.5 h-3.5 w-3.5" />
            Setup Recording
          </Link>
        </Button>
      </div>
    </div>
  );
}
