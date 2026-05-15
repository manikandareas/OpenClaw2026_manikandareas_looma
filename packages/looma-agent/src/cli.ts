#!/usr/bin/env node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { LoomaApiClient } from "./client";
import { setupClaudeCode } from "./setup";
import { ACTIVE_SESSION_PATH, readActiveSession } from "./session-file";

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
    await runDoctor();
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

async function runDoctor() {
  const appUrl = process.env.LOOMA_API_URL ?? "http://localhost:3000";
  const apiKey = process.env.LOOMA_API_KEY;
  const activeSession = await readActiveSession();
  const projectDir = process.cwd();

  const checks = [
    ["LOOMA_API_URL", appUrl],
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
    try {
      await new LoomaApiClient({ apiUrl: appUrl, apiKey }).doctor();
      process.stdout.write("API auth: ok\n");
    } catch (error) {
      process.stdout.write(`API auth: failed (${error instanceof Error ? error.message : "unknown error"})\n`);
    }
  }
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
  looma doctor
  looma mcp
  looma hook
`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Unknown error"}\n`);
  process.exitCode = 1;
});
