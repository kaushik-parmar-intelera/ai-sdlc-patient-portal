import { render, screen } from "@testing-library/react";

import { StatePanels } from "@/components/organisms/state-panels";
import { deriveUiState } from "@/controllers/ui-state.controller";

describe("US3 UI state transitions", () => {
  it("transitions loading -> empty -> error -> success with expected rendering", () => {
    const { rerender } = render(
      <StatePanels state={deriveUiState(null, true, null)} />,
    );
    expect(screen.getByText(/loading content/i)).toBeInTheDocument();

    rerender(<StatePanels state={deriveUiState(null, false, null)} />);
    expect(screen.getByText(/no content found/i)).toBeInTheDocument();

    rerender(
      <StatePanels
        state={deriveUiState(null, false, new Error("Network outage"))}
        onRetry={() => undefined}
      />,
    );
    expect(screen.getByText(/network outage/i)).toBeInTheDocument();

    rerender(
      <StatePanels
        state={deriveUiState({ ready: true }, false, null)}
        title="Patient Portal"
        subtitle="Secure access to care services"
      />,
    );
    expect(screen.getByText("Patient Portal")).toBeInTheDocument();
    expect(screen.getByText("Secure access to care services")).toBeInTheDocument();
  });
});
