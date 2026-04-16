import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { API_BASE_URL, AUTH_REFRESH_PATH } from '@/lib/config';

type CreateApiOptions = {
  refreshToken?: string;
  refreshPath?: string;
  onTokenRefreshed?: (tokens: { accessToken: string; refreshToken?: string }) => void;
  onUnauthorized?: () => void;
};

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

function pickString(source: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function normalizeRefreshResponse(payload: unknown): { accessToken: string; refreshToken?: string } | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const source = payload as Record<string, unknown>;
  const nested = source.data && typeof source.data === 'object' ? (source.data as Record<string, unknown>) : source;

  const accessToken = pickString(nested, ['access_token', 'accessToken', 'token']);
  const refreshToken = pickString(nested, ['refresh_token', 'refreshToken']);

  if (!accessToken) {
    return null;
  }

  return {
    accessToken,
    ...(refreshToken ? { refreshToken } : {}),
  };
}

function isRefreshRequest(url: string | undefined, refreshPath: string): boolean {
  if (!url) {
    return false;
  }

  return url === refreshPath || url.endsWith(refreshPath);
}

export function createApi(accessToken?: string, options: CreateApiOptions = {}): AxiosInstance {
  const refreshPath = options.refreshPath ?? AUTH_REFRESH_PATH;

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  const refreshClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let refreshPromise: Promise<{ accessToken: string; refreshToken?: string } | null> | null = null;

  const refreshAccessToken = async () => {
    if (!options.refreshToken) {
      return null;
    }

    if (!refreshPromise) {
      refreshPromise = refreshClient
        .post(refreshPath, {
          refresh_token: options.refreshToken,
        })
        .then((response) => normalizeRefreshResponse(response.data))
        .catch(() => null)
        .finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise;
  };

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalRequest = error.config as RetryRequestConfig | undefined;

      if (status === 401 && originalRequest) {
        if (!originalRequest._retry && !isRefreshRequest(originalRequest.url, refreshPath)) {
          originalRequest._retry = true;

          const refreshedTokens = await refreshAccessToken();

          if (refreshedTokens?.accessToken) {
            const authorizationHeader = `Bearer ${refreshedTokens.accessToken}`;

            api.defaults.headers.common.Authorization = authorizationHeader;
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = authorizationHeader;

            options.onTokenRefreshed?.(refreshedTokens);

            return api(originalRequest);
          }
        }

        options.onUnauthorized?.();
      }

      return Promise.reject(error);
    },
  );

  return api;
}
