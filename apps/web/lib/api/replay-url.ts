import { getAppUrl } from "@/lib/env";

export function getReplayUrl(sessionId: string) {
  return `${getAppUrl().replace(/\/$/, "")}/sessions/${sessionId}`;
}
