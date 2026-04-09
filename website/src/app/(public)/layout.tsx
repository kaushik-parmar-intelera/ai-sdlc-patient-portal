import React from 'react';

export const metadata = {
  title: 'Authentication | Patient Portal',
  description: 'Register or log in to access your patient portal',
};

export default function PublicAuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
