"use client";

import { useQueryStates } from "nuqs";
import { dashboardQueryParsers } from "@/features/dashboard/utils/dashboard-query-params";

export function useDashboardSessionFilters() {
  return useQueryStates(dashboardQueryParsers);
}
