import type { ViewportMode } from "../types/replay";

export function eventToMode(type: string): ViewportMode | null {
  switch (type) {
    case "terminal_command":
    case "terminal_output":
      return "terminal";
    case "file_write":
    case "file_read":
    case "file_snapshot":
      return "editor";
    case "file_diff":
      return "diff";
    case "test_result":
    case "build_result":
    case "lint_result":
      return "test";
    case "browser_snapshot":
      return "browser";
    default:
      return null;
  }
}
