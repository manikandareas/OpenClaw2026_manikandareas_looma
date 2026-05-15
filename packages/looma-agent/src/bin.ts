import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

export function isDirectCliEntry(importMetaUrl: string, argvPath: string | undefined): boolean {
  if (!argvPath) return false;

  try {
    return realpathSync(fileURLToPath(importMetaUrl)) === realpathSync(argvPath);
  } catch {
    return fileURLToPath(importMetaUrl) === argvPath;
  }
}

export function getCurrentCliCommand() {
  const entrypoint = process.argv[1];
  if (!entrypoint) {
    throw new Error("Unable to resolve Looma CLI entrypoint");
  }

  return {
    command: process.execPath,
    args: [realpathSync(entrypoint)],
  };
}

export function shellCommand(parts: string[]): string {
  return parts.map(shellQuote).join(" ");
}

function shellQuote(value: string): string {
  if (/^[A-Za-z0-9_/:=.,@%+-]+$/.test(value)) {
    return value;
  }

  return `'${value.replace(/'/g, "'\\''")}'`;
}
