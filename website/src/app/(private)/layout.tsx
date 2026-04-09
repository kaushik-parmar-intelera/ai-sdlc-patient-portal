'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/appointments', label: 'Appointments' },
  { href: '/lab-results', label: 'Health Records' },
  { href: '/prescriptions', label: 'Prescriptions' },
];

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-background">
      {/* ── Fixed top nav ──────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          {/* Left: logo + links */}
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-xl font-extrabold tracking-tight text-primary font-headline"
            >
              Clinical Curator
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors pb-0.5 ${
                      isActive
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: actions + avatar */}
          <div className="flex items-center gap-3">
            <button
              className="hidden md:block p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Emergency"
            >
              <span className="material-symbols-outlined text-[22px]">emergency</span>
            </button>
            <Link
              href="/profile"
              className="hidden md:inline-flex items-center px-5 py-2 rounded-full font-bold text-sm text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #002976 0%, #003da6 100%)' }}
            >
              Patient Portal
            </Link>
            <Link
              href="/profile"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0"
            >
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3zsKmYoEpYW1ZpAkJ8mzlpdndwGqhJhBrrgOtG8ZMtNuR5ShASDkCgGsfjud0q4zntiFpN0HgkdEzu5fw_ctUfc2T6Z-9Jin60utWRbkPCvqpr1aafZasKVCe5Aauvwyovz_xuLsIVCTsup5_ecKu8Z95B6KQT0_AAJCM3UvU7H9IMaZ9OZfurKKenfrMwYrcEeV_4C-eEmn_Tp5WdHvHXptBQtVm7wjTiE3V48TUMig2664XbwDNYnC2VYVNoM3IxCMOsm8ds5Q"
              />
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-surface-container transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-on-surface-variant">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile backdrop ─────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      <aside
        aria-label="Mobile navigation"
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-surface-container-lowest z-50 transform transition-transform duration-300 shadow-ambient-lg ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between">
          <span className="font-headline font-extrabold text-lg text-primary">Clinical Curator</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg hover:bg-surface-container"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <nav className="px-4 py-6 space-y-1" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === item.href
                  ? 'bg-primary text-white font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              pathname === '/profile'
                ? 'bg-primary text-white font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            My Profile
          </Link>
        </nav>
        <div className="px-4 py-4 border-t border-outline-variant/30">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-all text-sm font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────── */}
      <main id="main-content" className="pt-[72px]">
        {children}
      </main>
    </div>
  );
}
