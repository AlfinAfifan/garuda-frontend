export const API_BASE_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';

export const AUTH_LOGIN_PATH = process.env.AUTH_LOGIN_PATH ?? '/auth/login';
export const AUTH_REFRESH_PATH = process.env.AUTH_REFRESH_PATH ?? '/auth/refresh';
