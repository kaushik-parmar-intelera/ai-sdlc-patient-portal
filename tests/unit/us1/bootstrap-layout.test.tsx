import { useQueryClient } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import RootLayout from "@/app/layout";
import { Providers } from "@/app/providers";

const QueryClientProbe = () => {
  const client = useQueryClient();
  return <span data-testid="stale-time">{String(client.getDefaultOptions().queries?.staleTime ?? 0)}</span>;
};

describe("US1 bootstrap layout/provider wiring", () => {
  it("renders root layout with skip navigation and child content", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <div>Starter Content</div>
      </RootLayout>,
    );

    expect(markup).toContain("Skip to main content");
    expect(markup).toContain("Starter Content");
    expect(markup).toContain('id="main-content"');
  });

  it("mounts query client provider with baseline defaults", () => {
    render(
      <Providers>
        <QueryClientProbe />
      </Providers>,
    );

    expect(screen.getByTestId("stale-time")).toHaveTextContent("30000");
  });
});
