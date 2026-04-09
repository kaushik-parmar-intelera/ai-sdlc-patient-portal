"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthSessionStore } from "@/store/auth-session.store";

/**
 * Root entry point — reads auth state from localStorage (via Zustand persist)
 * and redirects to the appropriate screen immediately.
 */
export default function RootPage() {
  const router = useRouter();
  const isAuthenticated = useAuthSessionStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Show a neutral splash while the redirect resolves
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-white text-2xl">medical_services</span>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
