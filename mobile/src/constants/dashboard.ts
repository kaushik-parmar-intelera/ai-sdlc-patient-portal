import type { DashboardSummary } from "../types/dashboard";

export const DASHBOARD_SUMMARY: DashboardSummary = {
  metrics: [
    { label: "Upcoming visit", value: "Tue 10:30 AM", caption: "Primary care", tone: "teal" },
    { label: "Care tasks", value: "03", caption: "Needs follow-up", tone: "gold" },
    { label: "Unread messages", value: "02", caption: "From care team", tone: "coral" },
  ],
  actions: [
    {
      label: "View labs",
      description: "Preview the action layout for incoming lab results.",
      placeholderMessage: "Lab results will be connected in a later API phase.",
    },
    {
      label: "Request refill",
      description: "Review the CTA treatment for prescription actions.",
      placeholderMessage: "Prescription refill is a placeholder in this MVP.",
    },
    {
      label: "Message care team",
      description: "Validate the dashboard action styling for communication flows.",
      placeholderMessage: "Care team messaging will be enabled in a later sprint.",
    },
  ],
};

export const DASHBOARD_ACTIONS = DASHBOARD_SUMMARY.actions;
