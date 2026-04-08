import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

import { SkipLink } from "@/components/molecules/skip-link";
import { StatePanels } from "@/components/organisms/state-panels";

describe("US3 state components and keyboard behavior", () => {
  it("renders loading, empty, and success states consistently", () => {
    const { rerender } = render(
      <StatePanels state={{ kind: "loading", message: "Loading content..." }} />,
    );
    expect(screen.getByText(/loading content/i)).toBeInTheDocument();

    rerender(<StatePanels state={{ kind: "empty", message: "No data available yet." }} />);
    expect(screen.getByText(/no content found/i)).toBeInTheDocument();

    rerender(
      <StatePanels
        state={{ kind: "success" }}
        title="Portal Ready"
        subtitle="Secure access to care services"
      />,
    );
    expect(screen.getByText("Portal Ready")).toBeInTheDocument();
    expect(screen.getByText("Secure access to care services")).toBeInTheDocument();
  });

  it("renders error state with actionable retry control", async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();

    render(
      <StatePanels
        state={{ kind: "error", message: "Request failed", recoveryActionLabel: "Retry" }}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText(/request failed/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("keeps skip link as first keyboard focus target", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <SkipLink />
        <a href="/public">Public</a>
      </div>,
    );

    await user.tab();
    expect(screen.getByRole("link", { name: /skip to main content/i })).toHaveFocus();
  });
});
