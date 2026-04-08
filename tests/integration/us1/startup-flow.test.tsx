import { render, screen, waitFor } from "@testing-library/react";

import HomePage from "@/app/page";
import { Providers } from "@/app/providers";
import { fetchStartupPayload, type StartupPayload } from "@/services/query/startup-query";

jest.mock("@/services/query/startup-query", () => ({
  fetchStartupPayload: jest.fn(),
}));

const mockFetchStartupPayload = fetchStartupPayload as jest.MockedFunction<typeof fetchStartupPayload>;

describe("US1 startup route rendering flow", () => {
  beforeEach(() => {
    mockFetchStartupPayload.mockReset();
  });

  it("shows loading first and then renders startup content", async () => {
    let resolvePayload: ((value: StartupPayload) => void) | null = null;
    const pending = new Promise<StartupPayload>((resolve) => {
      resolvePayload = resolve;
    });
    mockFetchStartupPayload.mockReturnValueOnce(pending);

    render(
      <Providers>
        <HomePage />
      </Providers>,
    );

    expect(screen.getByText(/loading content/i)).toBeInTheDocument();

    resolvePayload?.({
      title: "Patient Portal",
      subtitle: "Secure access to care services",
      items: ["Browse services"],
    });

    await waitFor(() => {
      expect(screen.getByText("Secure access to care services")).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: "Public" })).toHaveAttribute("href", "/public");
    expect(screen.getByRole("link", { name: "Private" })).toHaveAttribute("href", "/private");
  });

  it("renders actionable error state when startup bootstrap fails", async () => {
    mockFetchStartupPayload.mockRejectedValueOnce(new Error("Startup API unavailable"));

    render(
      <Providers>
        <HomePage />
      </Providers>,
    );

    await waitFor(() => {
      expect(screen.getByText(/startup api unavailable/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
