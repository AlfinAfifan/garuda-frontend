export type RoleName = string;

export type RouteRoleRule = {
  route: string;
  allowedRoles: RoleName[];
};

export const ROUTE_ROLE_RULES: RouteRoleRule[] = [
  { route: '/dashboard', allowedRoles: [] },
  { route: '/institution', allowedRoles: ['super_admin', 'admin', 'kwarran'] },
  { route: '/member', allowedRoles: [] },
  { route: '/tku', allowedRoles: [] },
  { route: '/tkk', allowedRoles: [] },
  { route: '/garuda', allowedRoles: [] },
  { route: '/user', allowedRoles: ['super_admin'] },
  { route: '/tkk-master', allowedRoles: ['super_admin', 'admin'] },
  { route: '/region', allowedRoles: ['super_admin', 'admin'] },
  { route: '/religion', allowedRoles: ['super_admin', 'admin'] },
  { route: '/notification', allowedRoles: ['super_admin'] },
];

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function normalizeRole(role: string): string {
  return role.trim().toLowerCase();
}

function routeMatches(pathname: string, route: string): boolean {
  const normalizedPathname = normalizePath(pathname);
  const normalizedRoute = normalizePath(route);

  return normalizedPathname === normalizedRoute || normalizedPathname.startsWith(`${normalizedRoute}/`);
}

export function extractUserRole(source?: Record<string, unknown> | null): string | undefined {
  if (!source) {
    return undefined;
  }

  const nestedUser = source.user && typeof source.user === 'object' ? (source.user as Record<string, unknown>) : undefined;
  const candidates: unknown[] = [
    source.role,
    source.user_role,
    source.role_name,
    source.userRole,
    nestedUser?.role,
    nestedUser?.user_role,
    nestedUser?.role_name,
    nestedUser?.userRole,
    source.type,
    Array.isArray(source.roles) ? source.roles[0] : undefined,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return normalizeRole(candidate);
    }
  }

  return undefined;
}

export function extractUserLevel(source?: Record<string, unknown> | null): string | undefined {
  if (!source) {
    return undefined;
  }

  const nestedUser = source.user && typeof source.user === 'object' ? (source.user as Record<string, unknown>) : undefined;
  const candidates: unknown[] = [source.level, source.user_level, source.level_name, source.userLevel, nestedUser?.level, nestedUser?.user_level, nestedUser?.level_name, nestedUser?.userLevel];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim().toLowerCase();
    }
  }

  return undefined;
}

function getMatchedRule(pathname: string): RouteRoleRule | undefined {
  const matched = ROUTE_ROLE_RULES.filter((rule) => routeMatches(pathname, rule.route));

  if (!matched.length) {
    return undefined;
  }

  return matched.sort((left, right) => right.route.length - left.route.length)[0];
}

export function isRoleAllowedForRoute(pathname: string, role?: string): boolean {
  const rule = getMatchedRule(pathname);

  if (!rule) {
    return true;
  }

  if (rule.allowedRoles.length === 0) {
    return true;
  }

  if (!role) {
    return false;
  }

  const normalizedRole = normalizeRole(role);

  return rule.allowedRoles.map(normalizeRole).includes(normalizedRole);
}

export function isProtectedRoute(pathname: string): boolean {
  return Boolean(getMatchedRule(pathname));
}

export function getDefaultAuthorizedRoute(role?: string): string {
  if (!role) {
    return '/dashboard';
  }

  const normalizedRole = normalizeRole(role);
  const firstAllowed = ROUTE_ROLE_RULES.find((rule) => rule.allowedRoles.length === 0 || rule.allowedRoles.map(normalizeRole).includes(normalizedRole));

  return firstAllowed?.route ?? '/dashboard';
}
