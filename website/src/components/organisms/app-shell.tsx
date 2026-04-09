import type { PropsWithChildren } from "react";

export const AppShell = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
    <header className="border-b border-slate-200 bg-[var(--surface)] px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <h1 className="text-lg font-semibold text-brand-700">Patient Portal</h1>
        <nav aria-label="Primary">
          <ul className="flex gap-4 text-sm">
            <li>
              <a href="/public">Public</a>
            </li>
            <li>
              <a href="/private">Private</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <div className="mx-auto max-w-5xl p-4">
      {children}
    </div>
  </div>
);
