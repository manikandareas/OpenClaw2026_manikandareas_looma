import { useQuery } from "@tanstack/react-query";
import type { GetSessionsResponse } from "@/types/session";
import type { SessionStatus } from "@/types/session";
import { useDashboardSessionFilters } from "@/features/dashboard/hooks/use-dashboard-session-filters";
import {
  mapDashboardStatusToApi,
  timeRangeToDateBounds,
} from "@/features/dashboard/utils/dashboard-session-filters";
import type {
  DashboardStatusFilter,
  DashboardTimeRange,
} from "@/features/dashboard/utils/dashboard-query-params";

function buildQueryString(params: {
  limit: string;
  statuses?: SessionStatus[];
  since?: string;
  until?: string;
}) {
  const sp = new URLSearchParams();
  sp.set("limit", params.limit);
  for (const s of params.statuses ?? []) {
    sp.append("status", s);
  }
  if (params.since) sp.set("since", params.since);
  if (params.until) sp.set("until", params.until);
  return sp.toString();
}

export async function fetchRecentSessions(params: {
  limit: string;
  time: DashboardTimeRange;
  status: DashboardStatusFilter;
}): Promise<GetSessionsResponse> {
  const apiStatuses = mapDashboardStatusToApi(
    params.status === "all" ? null : params.status,
  );
  const dateBounds = timeRangeToDateBounds(params.time);
  const qs = buildQueryString({
    limit: params.limit,
    statuses: apiStatuses,
    since: dateBounds.since,
    until: dateBounds.until,
  });
  const res = await fetch(`/api/sessions?${qs}`);
  if (!res.ok) throw new Error("Failed to fetch recent sessions");
  return res.json();
}

/**
 * Dashboard session list. Reads `time` and `status` from nuqs URL state.
 */
export function useRecentSessions(limit = "5") {
  const [{ time, status }] = useDashboardSessionFilters();

  const apiStatuses = mapDashboardStatusToApi(
    status === "all" ? null : status,
  );
  const dateBounds = timeRangeToDateBounds(time);

  return useQuery({
    queryKey: ["sessions", { limit, time, status, dateBounds, apiStatuses }],
    queryFn: () => fetchRecentSessions({ limit, time, status }),
  });
}
