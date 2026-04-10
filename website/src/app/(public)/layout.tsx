'use client';

import React from 'react';
import { Toaster } from 'sonner';

export default function PublicAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
