#!/usr/bin/env node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { isDirectCliEntry } from "./bin";
import { LoomaApiClient } from "./client";
import { setupClaudeCode } from "./setup";
import { ACTIVE_SESSION_PATH, readActiveSession } from "./session-file";

const DEFAULT_LOOMA_API_URL = "https://looma-gold.vercel.app";

type ParsedArgs = {
  command: string[];
  flags: Record<string, string | boolean>;
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [command, subcommand] = args.command;

  if (!command || command === "help" || args.flags.help) {
    printHelp();
    return;
  }

  if (command === "setup" && subcommand === "claude-code") {
    const appUrl = readRequiredFlag(args, "app-url");
    const apiKey = readRequiredFlag(args, "api-key");
    const projectDir = readStringFlag(args, "project-dir") ?? process.cwd();
    const result = await setupClaudeCode({ appUrl, apiKey, projectDir });
    process.stdout.write(
      [
        "Looma Claude Code setup complete.",
        `MCP config: ${result.mcpPath}`,
        `Hook config: ${result.claudeSettingsPath}`,
        "Run `looma doctor` to verify local configuration.",
      ].join("\n") + "\n"
    );
    return;
  }

  if (command === "doctor") {
    await runDoctor({ e2e: args.flags.e2e === true });
    return;
  }

  if (command === "mcp") {
    const { runMcpServer } = await import("./mcp");
    await runMcpServer();
    return;
  }

  if (command === "hook") {
    const { runHookBridge } = await import("./hook");
    await runHookBridge();
    return;
  }

  throw new Error(`Unknown command: ${args.command.join(" ")}`);
}

function parseArgs(raw: string[]): ParsedArgs {
  const command: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let index = 0; index < raw.length; index += 1) {
    const item = raw[index];
    if (!item.startsWith("--")) {
      command.push(item);
      continue;
    }

    const [flagName, inlineValue] = item.slice(2).split("=", 2);
    if (inlineValue !== undefined) {
      flags[flagName] = inlineValue;
      continue;
    }

    const next = raw[index + 1];
    if (next && !next.startsWith("--")) {
      flags[flagName] = next;
      index += 1;
    } else {
      flags[flagName] = true;
    }
  }

  return { command, flags };
}

async function runDoctor(options: { e2e: boolean }) {
  const appUrl = process.env.LOOMA_API_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_LOOMA_API_URL;
  const apiKey = process.env.LOOMA_API_KEY;
  const activeSession = await readActiveSession();
  const projectDir = process.cwd();

  const checks = [
    ["LOOMA_API_URL", appUrl ?? "missing"],
    ["LOOMA_API_KEY", apiKey ? "set" : "missing"],
    ["active session", activeSession ?? "none"],
    [".mcp.json", existsSync(join(projectDir, ".mcp.json")) ? "found" : "missing"],
    [".claude/settings.local.json", existsSync(join(projectDir, ".claude", "settings.local.json")) ? "found" : "missing"],
    ["active session file", ACTIVE_SESSION_PATH],
  ];

  for (const [label, value] of checks) {
    process.stdout.write(`${label}: ${value}\n`);
  }

  if (apiKey) {
    const client = new LoomaApiClient({ apiUrl: appUrl, apiKey });
    try {
      await client.doctor();
      process.stdout.write("API auth: ok\n");
    } catch (error) {
      process.stdout.write(`API auth: failed (${error instanceof Error ? error.message : "unknown error"})\n`);
      throw error;
    }

    if (options.e2e) {
      try {
        const started = await client.createSession({
          name: `Looma doctor E2E ${new Date().toISOString()}`,
          harness: "looma-doctor",
          agentName: "looma-agent",
          workspaceName: projectDir,
          sourceType: "mcp",
        });
        const sessionId = getSessionId(started);
        await client.recordEvent(sessionId, {
          type: "doctor_e2e",
          category: "system",
          source: "looma-agent",
          actor: "agent",
          displayText: "Looma doctor verified record_start, record_event, and record_stop.",
          sensitivity: "none",
          payload: {
            package: "looma-agent",
          },
        });
        const stopped = await client.stopSession(sessionId, {
          finalOutput: {
            title: "Looma doctor E2E",
            content: "Looma doctor successfully verified the public agent bridge end to end.",
            format: "markdown",
            sensitivity: "none",
          },
        });
        process.stdout.write(`API e2e: ok (${getReplayUrl(stopped) ?? sessionId})\n`);
      } catch (error) {
        process.stdout.write(`API e2e: failed (${error instanceof Error ? error.message : "unknown error"})\n`);
        throw error;
      }
    }
  }

}

function getSessionId(value: unknown): string {
  if (value && typeof value === "object" && "sessionId" in value && typeof value.sessionId === "string") {
    return value.sessionId;
  }

  throw new Error("Looma API did not return a sessionId");
}

function getReplayUrl(value: unknown): string | null {
  if (value && typeof value === "object" && "replayUrl" in value && typeof value.replayUrl === "string") {
    return value.replayUrl;
  }

  return null;
}

function readRequiredFlag(args: ParsedArgs, flag: string): string {
  const value = readStringFlag(args, flag);
  if (!value) {
    throw new Error(`Missing --${flag}`);
  }
  return value;
}

function readStringFlag(args: ParsedArgs, flag: string): string | null {
  const value = args.flags[flag];
  return typeof value === "string" ? value : null;
}

function printHelp() {
  process.stdout.write(`Looma agent CLI

Usage:
  looma setup claude-code --app-url <url> --api-key <token> [--project-dir <path>]
  looma doctor [--e2e]
  looma mcp
  looma hook
`);
}

if (isDirectCliEntry(import.meta.url, process.argv[1])) {
  main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : "Unknown error"}\n`);
    process.exitCode = 1;
  });
}
