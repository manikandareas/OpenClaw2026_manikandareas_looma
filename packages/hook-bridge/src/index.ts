#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { normalizeToolCall } from "./normalize";

const ACTIVE_SESSION_PATH = join(homedir(), ".looma", "active_session");

async function main() {
  try {
    const [toolName, toolInputRaw, toolOutputRaw] = process.argv.slice(2);

    if (!toolName) return;

    let sessionId: string;
    try {
      sessionId = (await readFile(ACTIVE_SESSION_PATH, "utf-8")).trim();
      if (!sessionId) return;
    } catch {
      return;
    }

    const apiUrl = (process.env.LOOMA_API_URL ?? "http://localhost:3000").replace(/\/$/, "");
    const apiKey = process.env.LOOMA_API_KEY;
    if (!apiKey) return;

    const toolInput = safeParse(toolInputRaw);
    const toolOutput = safeParse(toolOutputRaw);

    const event = normalizeToolCall(toolName, toolInput, toolOutput);
    if (!event) return;

    const response = await fetch(`${apiUrl}/api/sessions/${sessionId}/events`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      process.stderr.write(`[looma-hook] API error: ${response.status}\n`);
    }
  } catch (err) {
    process.stderr.write(`[looma-hook] ${err instanceof Error ? err.message : "unknown error"}\n`);
  }
}

function safeParse(raw: string | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { raw };
  }
}

main();
