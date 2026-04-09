import type { DashboardMetric, DashboardSummary } from "../../types/dashboard";

export function buildDashboardCards(summary: DashboardSummary): DashboardMetric[] {
  return summary.metrics;
}
