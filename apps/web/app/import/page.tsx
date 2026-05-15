import { AppNav } from "@/features/app-shell/components/app-nav";
import { ImportForm } from "@/features/import/components/import-form";

export default function ImportPage() {
  return (
    <>
      <AppNav />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-semibold tracking-normal">Import transcript</h1>
        <p className="mt-2 text-muted-foreground">
          Upload or paste a JSON array of agent events to create a replay session.
        </p>
        <div className="mt-6">
          <ImportForm />
        </div>
      </main>
    </>
  );
}
