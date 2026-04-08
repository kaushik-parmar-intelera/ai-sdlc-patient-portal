import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { Providers } from "./providers";
import { SkipLink } from "@/components/molecules/skip-link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Patient Portal",
  description: "Website workspace baseline",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <SkipLink />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
