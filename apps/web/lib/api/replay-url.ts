import { getAppUrl } from "@/lib/env";

export function getReplayUrl(sessionId: string) {
  return `${getAppUrl().replace(/\/$/, "")}/session/${sessionId}`;
}
