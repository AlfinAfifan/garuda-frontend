import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface SessionUserMeta {
    role?: string;
    level?: string;
    institution_id?: string;
    institution_name?: string;
    district_id?: string;
    district_name?: string;
  }

  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: DefaultSession['user'] & SessionUserMeta & Record<string, unknown>;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    user?: SessionUserMeta & Record<string, unknown>;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    user?: Record<string, unknown>;
  }
}
