"use client";

import { EmptyState } from "@/components/atoms/empty-state";
import { ErrorState } from "@/components/atoms/error-state";
import { LoadingState } from "@/components/atoms/loading-state";
import { SuccessState } from "@/components/atoms/success-state";
import type { UiState } from "@/types/ui-state";

interface StatePanelsProps {
  state: UiState;
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
}

export const StatePanels = ({ state, title = "Patient Portal", subtitle = "Welcome", onRetry }: StatePanelsProps) => {
  switch (state.kind) {
    case "loading":
      return <LoadingState />;
    case "empty":
      return <EmptyState />;
    case "error":
      return <ErrorState message={state.message || "Unknown error"} onRetry={onRetry} />;
    case "success":
      return <SuccessState title={title} subtitle={subtitle} />;
    default:
      return <EmptyState />;
  }
};
