"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Check, Copy, KeyRound, Radio, Terminal, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey
} from "@/features/dashboard/api/api-keys";

type ClaudeCodeSetupProps = {
  appUrl: string;
};

export function ClaudeCodeSetup({ appUrl }: ClaudeCodeSetupProps) {
  const [keyName, setKeyName] = useState("Claude Code local");
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const { data, isError, isPending } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();
  const keys = data?.keys ?? [];

  const tokenPlaceholder = createdToken ?? "<LOOMA_API_KEY>";
  const installCommand = "npm i -g looma-agent";
  const setupCommand = useMemo(
    () =>
      `looma setup claude-code --app-url ${appUrl} --api-key ${tokenPlaceholder}`,
    [appUrl, tokenPlaceholder]
  );
  const doctorCommand = useMemo(
    () =>
      `LOOMA_API_URL=${appUrl} LOOMA_API_KEY=${tokenPlaceholder} looma doctor`,
    [appUrl, tokenPlaceholder]
  );

  async function handleCreateKey() {
    const result = await createApiKey.mutateAsync(keyName);
    setCreatedToken(result.token);
  }

  return (
    <Card className="rounded-lg shadow-none">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-muted p-2">
            <Radio className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">Claude Code Setup</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate a Looma API key, connect the MCP server, then add hooks for automatic tool capture.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">1. Create local API key</h3>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={keyName}
              onChange={(event) => setKeyName(event.target.value)}
              aria-label="API key name"
            />
            <Button onClick={handleCreateKey} disabled={createApiKey.isPending || !keyName.trim()}>
              Generate
            </Button>
          </div>
          {createdToken ? (
            <SecretBlock value={createdToken} />
          ) : (
            <p className="text-xs text-muted-foreground">
              The token is shown once. Existing keys below only show metadata.
            </p>
          )}
          <div className="space-y-2">
            <h4 className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
              Your API keys
            </h4>
            {isPending ? (
              <p className="rounded-md border border-dashed px-3 py-3 text-sm text-muted-foreground">
                Loading API keys...
              </p>
            ) : isError ? (
              <p className="rounded-md border border-destructive/30 px-3 py-3 text-sm text-destructive">
                Could not load API keys.
              </p>
            ) : keys.length === 0 ? (
              <p className="rounded-md border border-dashed px-3 py-3 text-sm text-muted-foreground">
                No API keys yet. Generate one above to connect Claude Code.
              </p>
            ) : (
              keys.map((key) => (
                <div
                  key={key.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(key.createdAt)}
                      {key.lastUsedAt ? ` · Last used ${formatDate(key.lastUsedAt)}` : ""}
                    </p>
                  </div>
                  {key.revokedAt ? (
                    <Badge variant="secondary">Revoked</Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeApiKey.mutate(key.id)}
                      disabled={revokeApiKey.isPending}
                    >
                      <XCircle className="h-4 w-4" /> Revoke
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <SetupStep
          title="2. Install Looma agent"
          icon={<Terminal className="h-4 w-4 text-muted-foreground" />}
          code={installCommand}
        />

        <SetupStep
          title="3. Connect Claude Code"
          icon={<Terminal className="h-4 w-4 text-muted-foreground" />}
          code={setupCommand}
        />

        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">4. Verify</h3>
          </div>
          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
            <p className="rounded-md border border-border px-3 py-2">
              Run <code className="text-foreground">looma doctor</code>.
            </p>
            <p className="rounded-md border border-border px-3 py-2">Ask Claude to call `record_start`.</p>
            <p className="rounded-md border border-border px-3 py-2">Open the returned `/sessions/...` URL.</p>
          </div>
          <CodeBlock value={doctorCommand} />
        </section>
      </CardContent>
    </Card>
  );
}

function SetupStep({
  title,
  icon,
  code
}: {
  title: string;
  icon: ReactNode;
  code: string;
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <CodeBlock value={code} />
    </section>
  );
}

function SecretBlock({ value }: { value: string }) {
  return (
    <div className="rounded-md border bg-muted/40 p-3">
      <p className="mb-2 text-xs text-muted-foreground">Copy this token now. Looma stores only its SHA-256 hash.</p>
      <CodeBlock value={value} />
    </div>
  );
}

function CodeBlock({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="relative rounded-md border border-border bg-muted/40 p-3">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 h-7 px-2"
        onClick={copyValue}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <pre className="max-h-72 overflow-auto pr-12 text-xs leading-relaxed">
        <code>{value}</code>
      </pre>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
