import type { UiState } from "@/types/ui-state";

export const deriveUiState = <T>(
  data: T | null,
  isLoading: boolean,
  error: Error | null,
): UiState => {
  if (isLoading) {
    return { kind: "loading", message: "Loading content..." };
  }

  if (error) {
    return {
      kind: "error",
      message: error.message || "Something went wrong.",
      recoveryActionLabel: "Retry",
    };
  }

  if (data == null) {
    return { kind: "empty", message: "No data available yet." };
  }

  return { kind: "success" };
};
