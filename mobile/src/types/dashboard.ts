export type DashboardMetric = {
  caption: string;
  label: string;
  tone: "teal" | "gold" | "coral";
  value: string;
};

export type DashboardAction = {
  description: string;
  label: string;
  placeholderMessage: string;
};

export type DashboardSummary = {
  actions: DashboardAction[];
  metrics: DashboardMetric[];
};
