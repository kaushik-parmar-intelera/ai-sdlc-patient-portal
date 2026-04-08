"use client";

import { useQuery } from "@tanstack/react-query";

import { AppShell } from "@/components/organisms/app-shell";
import { StatePanels } from "@/components/organisms/state-panels";
import { deriveUiState } from "@/controllers/ui-state.controller";
import { fetchStartupPayload } from "@/services/query/startup-query";

export default function HomePage() {
  const startupQuery = useQuery({
    queryKey: ["startup"],
    queryFn: fetchStartupPayload,
  });

  const uiState = deriveUiState(startupQuery.data || null, startupQuery.isLoading, startupQuery.error as Error | null);

  return (
    <AppShell>
      <StatePanels
        state={uiState}
        title={startupQuery.data?.title || "Patient Portal"}
        subtitle={startupQuery.data?.subtitle || "Welcome"}
        onRetry={() => startupQuery.refetch()}
      />
    </AppShell>
  );
}
