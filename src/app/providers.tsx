'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { useState, type ReactNode } from 'react';

import { createQueryClient } from '@/lib/query/query-client';

type AppProvidersProps = {
  children: ReactNode;
  session: Session | null;
};

export function AppProviders({ children, session }: AppProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
