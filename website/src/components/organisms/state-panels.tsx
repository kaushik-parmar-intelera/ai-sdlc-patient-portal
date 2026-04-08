"use client";

import { EmptyState } from "@/components/atoms/empty-state";
import { ErrorState } from "@/components/atoms/error-state";
import { LoadingState } from "@/components/atoms/loading-state";
import { SuccessState } from "@/components/atoms/success-state";
import { ErrorBanner } from "@/components/molecules/error-banner";
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
      return (
        <div className="space-y-2">
          <ErrorBanner code="E-STATE" message={state.message || "Unknown error"} recoveryAction="Try again" />
          <ErrorState message={state.message || "Unknown error"} onRetry={onRetry} />
        </div>
      );
    case "success":
      return <SuccessState title={title} subtitle={subtitle} />;
    default:
      return <EmptyState />;
  }
};
