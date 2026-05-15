import { chmod } from "node:fs/promises";
import { join } from "node:path";

const distDir = new URL("../dist/", import.meta.url);

await Promise.all(
  ["cli.js", "mcp.js", "hook.js"].map((file) =>
    chmod(join(distDir.pathname, file), 0o755)
  )
);
