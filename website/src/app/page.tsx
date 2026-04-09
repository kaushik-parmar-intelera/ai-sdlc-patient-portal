"use client";

import { useQuery } from "@tanstack/react-query";

import { AppShell } from "@/components/organisms/app-shell";
import { StatePanels } from "@/components/organisms/state-panels";
import { deriveUiState } from "@/controllers/ui-state.controller";
import { fetchStartupPayload } from "@/services/query/startup-query";

export default function HomePage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["startup"],
    queryFn: fetchStartupPayload,
    retry: false,
  });

  const uiState = deriveUiState(data ?? null, isLoading, error as Error | null);

  return (
    <AppShell>
      <StatePanels
        state={uiState}
        title={data?.title}
        subtitle={data?.subtitle}
        onRetry={() => void refetch()}
      />
    </AppShell>
  );
}
