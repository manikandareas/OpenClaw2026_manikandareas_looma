import type { SessionStatus } from "@/types/session";
import type {
  DashboardStatusFilter,
  DashboardTimeRange,
} from "@/features/dashboard/utils/dashboard-query-params";

const DAY_MS = 86_400_000;

/**
 * URL `status` → DB statuses for /api/sessions.
 * Must match how sessions are created in the app (e.g. json_import → `processing`).
 */
export function mapDashboardStatusToApi(
  status: DashboardStatusFilter | null,
): SessionStatus[] | undefined {
  switch (status) {
    case "active":
      return ["recording", "processing"];
    case "completed":
      return ["replay_ready", "stopped"];
    case "failed":
      return ["failed"];
    default:
      return undefined;
  }
}

export type DateBounds = {
  since?: string;
  until?: string;
};

/** URL `time` label → ISO bounds for `created_at` (omit for all time). */
export function timeRangeToDateBounds(time: DashboardTimeRange): DateBounds {
  if (time === "All time") return {};

  const now = new Date();
  if (time === "Today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    return {
      since: start.toISOString(),
      until: end.toISOString(),
    };
  }
  if (time === "Last 7 days") {
    return { since: new Date(now.getTime() - 7 * DAY_MS).toISOString() };
  }
  if (time === "Last 30 days") {
    return { since: new Date(now.getTime() - 30 * DAY_MS).toISOString() };
  }
  return {};
}

/** Calendar columns for activity chart from the same `time` query as filters. */
export function timeRangeToChartDays(time: DashboardTimeRange): number {
  switch (time) {
    case "Today":
      return 1;
    case "Last 7 days":
      return 7;
    case "Last 30 days":
      return 30;
    default:
      return 7;
  }
}
