#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { LoomaApiClient } from "./client";
import { normalizeClaudeHook, type ClaudeHookInput } from "./normalize";
import { normalizedEventInputSchema } from "./schemas";
import { ACTIVE_SESSION_PATH, readActiveSession } from "./session-file";

export async function runHookBridge() {
  try {
    const hookInput = await readHookInput();
    if (!hookInput) return;

    const sessionId = await readActiveSession();
    if (!sessionId) return;

    const event = normalizeClaudeHook(hookInput);
    if (!event) return;

    const client = new LoomaApiClient();
    await client.recordEvent(sessionId, normalizedEventInputSchema.parse(event));
  } catch (err) {
    process.stderr.write(`[looma-hook] ${err instanceof Error ? err.message : "unknown error"}\n`);
  }
}

async function readHookInput(): Promise<ClaudeHookInput | null> {
  const raw = await readStdin();
  if (!raw.trim()) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? (parsed as ClaudeHookInput) : null;
  } catch {
    process.stderr.write("[looma-hook] invalid Claude Code hook JSON on stdin\n");
    return null;
  }
}

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) {
    await readFile(ACTIVE_SESSION_PATH, "utf-8").catch(() => "");
    return "";
  }

  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runHookBridge();
}
