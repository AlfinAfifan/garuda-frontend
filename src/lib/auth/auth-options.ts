import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { API_BASE_URL, AUTH_LOGIN_PATH } from '@/lib/config';

type BackendUser = {
  id?: string | number;
  name: string;
  email: string;
  role: string;
  level: string;
  institution_id?: string;
  institution_name?: string;
  district_id?: string;
  district_name?: string;
} & Record<string, unknown>;

type BackendLoginResponse = {
  access_token: string;
  refresh_token: string;
  user: BackendUser;
};

type UnknownRecord = Record<string, unknown>;

function pickString(source: UnknownRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return undefined;
}

function normalizeLoginResponse(payload: unknown): BackendLoginResponse | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const source = payload as UnknownRecord;
  const success = source.success;

  if (typeof success === 'boolean' && !success) {
    return null;
  }

  const nested = source.data && typeof source.data === 'object' ? (source.data as UnknownRecord) : source;

  const accessToken = pickString(nested, ['access_token', 'accessToken', 'token']);
  const refreshToken = pickString(nested, ['refresh_token', 'refreshToken']);

  const userCandidate = nested.user && typeof nested.user === 'object' ? (nested.user as UnknownRecord) : null;

  const userEmail = userCandidate ? pickString(userCandidate, ['email']) : undefined;
  const userName = userCandidate ? pickString(userCandidate, ['name']) : undefined;
  const userRole = userCandidate ? pickString(userCandidate, ['role', 'user_role', 'role_name']) : undefined;
  const userLevel = userCandidate ? pickString(userCandidate, ['level', 'user_level', 'level_name']) : undefined;

  if (!accessToken || !refreshToken || !userCandidate || !userEmail || !userName || !userRole || !userLevel) {
    return null;
  }

  const normalizedUser: BackendUser = {
    ...(userCandidate as Record<string, unknown>),
    email: userEmail,
    name: userName,
    role: userRole,
    level: userLevel,
  };

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: normalizedUser,
  };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'anggota@pramuka.id',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          const response = await fetch(`${API_BASE_URL}${AUTH_LOGIN_PATH}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            cache: 'no-store',
          });

          const json = (await response.json().catch(() => null)) as unknown;

          if (!response.ok) {
            if (process.env.NODE_ENV !== 'production') {
              console.error('NextAuth login failed', {
                status: response.status,
                url: `${API_BASE_URL}${AUTH_LOGIN_PATH}`,
                response: json,
              });
            }
            return null;
          }

          const data = normalizeLoginResponse(json);

          if (!data) {
            if (process.env.NODE_ENV !== 'production') {
              console.error('NextAuth login response shape is invalid', {
                url: `${API_BASE_URL}${AUTH_LOGIN_PATH}`,
                response: json,
              });
            }
            return null;
          }

          const userId = data.user.id ?? data.user.email ?? data.user.name ?? credentials.email;

          return {
            id: String(userId),
            name: typeof data.user.name === 'string' ? data.user.name : undefined,
            email: typeof data.user.email === 'string' ? data.user.email : credentials.email,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            user: data.user,
          };
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('NextAuth authorize error', error);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.user = (user.user as Record<string, unknown>) ?? {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }

      if (trigger === 'update' && session) {
        const updatedSession = session as Record<string, unknown>;

        if (typeof updatedSession.accessToken === 'string') {
          token.accessToken = updatedSession.accessToken;
        }

        if (typeof updatedSession.refreshToken === 'string') {
          token.refreshToken = updatedSession.refreshToken;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      if (token.user) {
        session.user = {
          ...(session.user ?? {}),
          ...(token.user as Record<string, unknown>),
        };
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
