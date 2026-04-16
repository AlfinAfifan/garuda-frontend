'use client';

import { signOut, useSession } from 'next-auth/react';
import { useCallback, useMemo } from 'react';

import { createApi } from '@/lib/api/api';

export function useApi() {
  const { data, update } = useSession();
  const accessToken = data?.accessToken;
  const refreshToken = data?.refreshToken;
  const isSessionReady = data !== undefined;

  const handleUnauthorized = useCallback(() => {
    void signOut({ callbackUrl: '/login' });
  }, []);

  const handleTokenRefreshed = useCallback(
    (tokens: { accessToken: string; refreshToken?: string }) => {
      void update({
        accessToken: tokens.accessToken,
        ...(tokens.refreshToken ? { refreshToken: tokens.refreshToken } : {}),
      });
    },
    [update],
  );

  const api = useMemo(
    () =>
      createApi(accessToken, {
        refreshToken,
        onTokenRefreshed: handleTokenRefreshed,
        onUnauthorized: handleUnauthorized,
      }),
    [accessToken, refreshToken, handleTokenRefreshed, handleUnauthorized],
  );

  return { api, isSessionReady };
}
