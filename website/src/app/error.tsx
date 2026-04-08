"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-3 rounded-md border border-red-200 bg-red-50 p-4">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="text-red-700">{error.message}</p>
      <button className="rounded bg-red-700 px-3 py-1 text-white" onClick={reset} type="button">
        Retry
      </button>
    </div>
  );
}
