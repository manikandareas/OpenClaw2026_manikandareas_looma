#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { normalizeClaudeHook, type ClaudeHookInput } from "./normalize";

const ACTIVE_SESSION_PATH = join(homedir(), ".looma", "active_session");
const DEFAULT_LOOMA_API_URL = "https://looma-gold.vercel.app";

async function main() {
  try {
    const hookInput = await readHookInput();
    if (!hookInput) return;

    const sessionId = await readActiveSession();
    if (!sessionId) return;

    const apiKey = process.env.LOOMA_API_KEY;
    if (!apiKey) return;

    const event = normalizeClaudeHook(hookInput);
    if (!event) return;

    const rawApiUrl = process.env.LOOMA_API_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_LOOMA_API_URL;
    const apiUrl = rawApiUrl.replace(/\/$/, "");
    const response = await fetch(`${apiUrl}/api/sessions/${sessionId}/events`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(3000)
    });

    if (!response.ok) {
      process.stderr.write(`[looma-hook] API error: ${response.status}\n`);
    }
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

async function readActiveSession(): Promise<string | null> {
  try {
    const sessionId = (await readFile(ACTIVE_SESSION_PATH, "utf-8")).trim();
    return sessionId || null;
  } catch {
    return null;
  }
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

void main();
