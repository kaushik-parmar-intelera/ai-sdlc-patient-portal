export type UiStateKind = "loading" | "empty" | "error" | "success";

export interface UiState {
  kind: UiStateKind;
  message?: string;
  recoveryActionLabel?: string;
}
