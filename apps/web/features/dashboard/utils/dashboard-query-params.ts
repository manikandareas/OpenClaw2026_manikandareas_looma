import { parseAsStringLiteral } from "nuqs";

export const DASHBOARD_TIME_RANGES = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "All time",
] as const;

export const DASHBOARD_STATUS_FILTERS = [
  "active",
  "completed",
  "failed",
  "all",
] as const;

export type DashboardTimeRange = (typeof DASHBOARD_TIME_RANGES)[number];
export type DashboardStatusFilter = (typeof DASHBOARD_STATUS_FILTERS)[number];

export const dashboardQueryParsers = {
  time: parseAsStringLiteral(DASHBOARD_TIME_RANGES).withDefault("All time"),
  status: parseAsStringLiteral(DASHBOARD_STATUS_FILTERS).withDefault("all"),
};
