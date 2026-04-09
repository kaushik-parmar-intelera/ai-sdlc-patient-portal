import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Manrope, Inter } from 'next/font/google';

import { Providers } from "./providers";
import { SkipLink } from "@/components/molecules/skip-link";

import "./globals.css";

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Patient Portal",
  description: "Website workspace baseline",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" data-theme="light" className={`${manrope.variable} ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body>
        <SkipLink />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
