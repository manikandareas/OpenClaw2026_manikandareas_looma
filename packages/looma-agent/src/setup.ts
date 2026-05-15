import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

type SetupClaudeCodeInput = {
  appUrl: string;
  apiKey: string;
  projectDir: string;
};

export async function setupClaudeCode(input: SetupClaudeCodeInput) {
  const projectDir = resolve(input.projectDir);
  const appUrl = input.appUrl.replace(/\/$/, "");

  const mcpPath = join(projectDir, ".mcp.json");
  const claudeSettingsPath = join(projectDir, ".claude", "settings.local.json");

  const mcpConfig = readObject(await readJson(mcpPath));
  const mcpServers = readObject(mcpConfig.mcpServers);
  mcpServers.looma = {
    command: "looma-mcp",
    env: {
      LOOMA_API_URL: appUrl,
      LOOMA_API_KEY: input.apiKey,
    },
  };
  mcpConfig.mcpServers = mcpServers;
  await writeJson(mcpPath, mcpConfig);

  const settings = readObject(await readJson(claudeSettingsPath));
  const env = readObject(settings.env);
  env.LOOMA_API_URL = appUrl;
  env.LOOMA_API_KEY = input.apiKey;
  settings.env = env;
  settings.hooks = mergeHooks(readObject(settings.hooks));
  await writeJson(claudeSettingsPath, settings);

  return {
    projectDir,
    mcpPath,
    claudeSettingsPath,
  };
}

function mergeHooks(existingHooks: Record<string, unknown>) {
  return {
    ...existingHooks,
    PostToolUse: upsertLoomaHook(existingHooks.PostToolUse),
    PostToolUseFailure: upsertLoomaHook(existingHooks.PostToolUseFailure),
  };
}

function upsertLoomaHook(value: unknown) {
  const entries = Array.isArray(value) ? value.filter(isRecord) : [];
  const withoutLooma = entries.filter((entry) => !JSON.stringify(entry).includes("looma-hook"));

  return [
    ...withoutLooma,
    {
      matcher: "*",
      hooks: [
        {
          type: "command",
          command: "looma-hook",
          async: true,
          timeout: 30,
        },
      ],
    },
  ];
}

async function readJson(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, "utf-8"));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

async function writeJson(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}

function readObject(value: unknown): Record<string, unknown> {
  return isRecord(value) ? { ...value } : {};
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
