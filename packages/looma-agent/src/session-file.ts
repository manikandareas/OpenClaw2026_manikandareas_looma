import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

export const LOOMA_DIR = join(homedir(), ".looma");
export const ACTIVE_SESSION_PATH = join(LOOMA_DIR, "active_session");

export async function writeActiveSession(sessionId: string): Promise<void> {
  await mkdir(LOOMA_DIR, { recursive: true });
  await writeFile(ACTIVE_SESSION_PATH, sessionId, "utf-8");
}

export async function clearActiveSession(): Promise<void> {
  try {
    await unlink(ACTIVE_SESSION_PATH);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code !== "ENOENT") {
      throw err;
    }
  }
}

export async function readActiveSession(): Promise<string | null> {
  try {
    const content = await readFile(ACTIVE_SESSION_PATH, "utf-8");
    return content.trim() || null;
  } catch {
    return null;
  }
}
