"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Clipboard,
  Copy,
  KeyRound,
  LoaderCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type CreatedApiKey,
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
} from "@/features/dashboard/api/api-keys";

type ApiKeysPageContentProps = {
  appUrl: string;
};

export function ApiKeysPageContent({ appUrl }: ApiKeysPageContentProps) {
  const [keyName, setKeyName] = useState("Claude Code local");
  const [createdKey, setCreatedKey] = useState<CreatedApiKey | null>(null);
  const { data, isError, isPending } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();

  const keys = data?.keys ?? [];
  const token = createdKey?.token ?? "<LOOMA_API_KEY>";
  const setupCommand = useMemo(
    () => `looma setup claude-code --app-url ${appUrl} --api-key ${token}`,
    [appUrl, token],
  );
  const doctorCommand = useMemo(
    () => `LOOMA_API_URL=${appUrl} LOOMA_API_KEY=${token} looma doctor --e2e`,
    [appUrl, token],
  );
  const claudeCodeSnippet = `npm i -g looma-agent@beta
${setupCommand}
${doctorCommand}`;

  async function handleCreateKey() {
    const result = await createApiKey.mutateAsync(keyName);
    setCreatedKey(result);
  }

  return (
    <main className="py-8">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-medium text-foreground">
              {createdKey
                ? "Your API key has been generated"
                : "Create a Looma API key"}
            </h1>
            <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
              {createdKey
                ? "Copy it now. Looma stores only its SHA-256 hash, so the secret cannot be shown again."
                : "Generate a key for Claude Code, then use the public looma-agent beta to record MCP and hook events."}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0 gap-1.5 rounded-md">
            <Link href="/docs/integrations/claude-code">
              Claude Code docs
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </header>

        <div className="mt-8 border-t pt-8">
          <section className="grid min-h-16 grid-cols-1 items-center gap-3 border-b pb-6 sm:grid-cols-[1fr_auto] sm:gap-4">
            <p className="text-sm text-muted-foreground">Key status</p>
            <KeyStatus
              created={Boolean(createdKey)}
              isCreating={createApiKey.isPending}
            />
          </section>

          <section className="space-y-4 py-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={keyName}
                onChange={(event) => setKeyName(event.target.value)}
                aria-label="API key name"
                className="h-10 rounded-md bg-card text-sm"
              />
              <Button
                onClick={handleCreateKey}
                disabled={createApiKey.isPending || !keyName.trim()}
                className="h-10 shrink-0 rounded-md px-4"
              >
                {createApiKey.isPending ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
                Generate key
              </Button>
            </div>

            <p className="text-sm leading-relaxed text-foreground">
              Make sure to copy your API key now as you will not be able to see it
              again.
            </p>
            <div className="flex gap-2">
              <SecretValue value={createdKey?.token ?? ""} />
              <CopyButton
                value={createdKey?.token ?? ""}
                label="Copy API key"
                disabled={!createdKey}
              />
            </div>
          </section>

          <section className="space-y-3 pb-6">
            <p className="text-sm leading-relaxed text-foreground">
              Start by connecting Claude Code to Looma. The setup command writes `.mcp.json` and `.claude/settings.local.json`; the doctor command verifies the full recording path.
            </p>
            <CodeBlock value={claudeCodeSnippet} />
          </section>

          <section className="border-t pt-8">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-sm font-medium text-foreground">
                  Your API keys
                </h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Existing keys only show metadata. Revoke keys you no longer use.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-auto justify-start px-0 text-[13px]">
                <Link href="/docs/integrations/claude-code">
                  Read integration guide
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            <ApiKeyList
              isError={isError}
              isPending={isPending}
              keys={keys}
              onRevoke={(id) => revokeApiKey.mutate(id)}
              revokePending={revokeApiKey.isPending}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

function KeyStatus({
  created,
  isCreating,
}: {
  created: boolean;
  isCreating: boolean;
}) {
  if (isCreating) {
    return (
      <div className="flex items-center gap-2 text-sm text-foreground">
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
        Provisioning...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-foreground">
      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-foreground" />
      </span>
      {created ? "Ready" : "Waiting for generation"}
    </div>
  );
}

function SecretValue({ value }: { value: string }) {
  return (
    <div className="min-w-0 flex-1 rounded-md border border-border/60 bg-muted/50 px-3 py-2.5 text-sm leading-snug text-muted-foreground shadow-sm">
      <p className="truncate font-mono">{value || "looma_********************************"}</p>
    </div>
  );
}

function CodeBlock({ value }: { value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">shell</span>
        <CopyButton value={value} label="Copy Claude Code setup" compact />
      </div>
      <pre className="overflow-auto pb-1 pr-2 font-mono text-sm leading-relaxed text-foreground">
        <code>{value}</code>
      </pre>
    </div>
  );
}

function CopyButton({
  value,
  label,
  compact = false,
  disabled = false,
}: {
  value: string;
  label: string;
  compact?: boolean;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      disabled={disabled}
      onClick={copyValue}
      className={
        compact
          ? "h-7 w-8 rounded-md bg-muted/60 shadow-none"
          : "h-10 w-10 rounded-md border border-border/60 bg-card shadow-sm"
      }
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : compact ? (
        <Copy className="h-4 w-4" />
      ) : (
        <Clipboard className="h-4 w-4" />
      )}
    </Button>
  );
}

function ApiKeyList({
  isError,
  isPending,
  keys,
  onRevoke,
  revokePending,
}: {
  isError: boolean;
  isPending: boolean;
  keys: {
    id: string;
    name: string;
    createdAt: string;
    lastUsedAt: string | null;
    revokedAt: string | null;
  }[];
  onRevoke: (id: string) => void;
  revokePending: boolean;
}) {
  if (isPending) {
    return (
      <p className="border-y py-5 text-[13px] text-muted-foreground">
        Loading API keys...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="border-y py-5 text-sm text-destructive">
        Could not load API keys.
      </p>
    );
  }

  if (keys.length === 0) {
    return (
      <p className="border-y py-5 text-[13px] text-muted-foreground">
        No API keys yet. Generate one above to connect Claude Code.
      </p>
    );
  }

  return (
    <div className="divide-y border-y">
      {keys.map((key) => (
        <div
          key={key.id}
          className="grid gap-4 py-5 sm:grid-cols-[1fr_auto] sm:items-center"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-foreground">{key.name}</p>
              {key.revokedAt ? <Badge variant="secondary">Revoked</Badge> : null}
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Created {formatDate(key.createdAt)}
              {key.lastUsedAt ? ` - Last used ${formatDate(key.lastUsedAt)}` : ""}
            </p>
          </div>
          {key.revokedAt ? null : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRevoke(key.id)}
              disabled={revokePending}
            >
              <XCircle className="h-4 w-4" />
              Revoke
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
