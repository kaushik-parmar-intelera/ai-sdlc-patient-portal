"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";

import { createQueryClient } from "@/lib/query/query-client";

export const Providers = ({ children }: PropsWithChildren) => {
  const [client] = useState(() => createQueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
