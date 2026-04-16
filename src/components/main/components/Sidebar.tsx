'use client';

import { extractUserRole, isRoleAllowedForRoute } from '@/lib/auth/role-access';
import { Bell, BookOpen, Bookmark, Factory, Globe, GraduationCap, House, Medal, Person, Persons, Star } from '@gravity-ui/icons';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

type SidebarProps = {
  isCollapsed?: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
};

type SidebarMenuItem = {
  label: string;
  icon: ReactNode;
  route: string;
};

const mainMenuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: <House className="size-5" />,
  },
  {
    label: 'Lembaga',
    route: '/institution',
    icon: <Factory className="size-5" />,
  },
  {
    label: 'Anggota',
    route: '/member',
    icon: <Persons className="size-5" />,
  },
  {
    label: 'TKU',
    route: '/tku',
    icon: <GraduationCap className="size-5" />,
  },
  {
    label: 'TKK',
    route: '/tkk',
    icon: <Medal className="size-5" />,
  },
  {
    label: 'Garuda',
    route: '/garuda',
    icon: <Bookmark className="size-5" />,
  },
  {
    label: 'User',
    route: '/user',
    icon: <Person className="size-5" />,
  },
];

const masterMenuItems: SidebarMenuItem[] = [
  {
    label: 'Master TKK',
    route: '/tkk-master',
    icon: <BookOpen className="size-5" />,
  },
  {
    label: 'Wilayah',
    route: '/region',
    icon: <Globe className="size-5" />,
  },
  {
    label: 'Agama',
    route: '/religion',
    icon: <Star className="size-5" />,
  },
  {
    label: 'Notification',
    route: '/notification',
    icon: <Bell className="size-5" />,
  },
];

export function Sidebar({ isCollapsed = false, isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const currentRole = extractUserRole((session?.user as Record<string, unknown> | undefined) ?? null);

  const visibleMainMenuItems = mainMenuItems.filter((item) => isRoleAllowedForRoute(item.route, currentRole));
  const visibleMasterMenuItems = masterMenuItems.filter((item) => isRoleAllowedForRoute(item.route, currentRole));

  const isRouteActive = (route: string) => pathname === route || pathname.startsWith(`${route}/`);

  const widthClass = isCollapsed ? 'w-20' : 'w-72';
  const mobilePositionClass = isOpen ? 'translate-x-0' : '-translate-x-full';

  const baseClassName = `fixed left-0 top-16 z-[45] h-[calc(100vh-4rem)] bg-white shadow-sm transition-all duration-300 ${widthClass}`;
  const modeClassName = isMobile ? `${mobilePositionClass} md:hidden` : 'hidden md:block';

  return (
    <aside className={`${baseClassName} ${modeClassName}`}>
      <div className="flex h-full flex-col overflow-y-auto pb-5 pt-4">
        {visibleMainMenuItems.length > 0 && (
          <>
            <div className="mb-3 flex items-center justify-between px-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-primary-300">MAIN</p>
            </div>
            <nav className="space-y-1.5">
              {visibleMainMenuItems.map((item) => {
                const isActive = isRouteActive(item.route);

                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`group flex w-full relative cursor-pointer items-center py-2.5 text-left transition ${isActive ? 'bg-primary-100 text-primary-700' : ' hover:bg-primary-50'} ${isCollapsed ? 'justify-center' : 'gap-4 px-6'}`}
                    onClick={() => {
                      router.push(item.route);
                      onClose?.();
                    }}
                    title={item.label}
                  >
                    <span className={`shrink-0 size-8 flex items-center justify-center rounded-full ${isActive ? 'text-white bg-primary-600' : ''}`}>{item.icon}</span>
                    {!isCollapsed && <span className="text-base font-medium leading-snug text-nowrap">{item.label}</span>}

                    {isActive && <span className="absolute h-full w-1.5 bg-primary-600 right-0"></span>}
                  </button>
                );
              })}
            </nav>
          </>
        )}

        {visibleMasterMenuItems.length > 0 && (
          <>
            <div className="mb-3 mt-5 flex items-center justify-between px-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-primary-300">MASTER</p>
            </div>
            <nav className="space-y-1">
              {visibleMasterMenuItems.map((item) => {
                const isActive = isRouteActive(item.route);

                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`group flex w-full relative cursor-pointer items-center py-2.5 text-left transition ${isActive ? 'bg-primary-100 text-primary-700' : ' hover:bg-primary-50'} ${isCollapsed ? 'justify-center' : 'gap-4 px-6'}`}
                    onClick={() => {
                      router.push(item.route);
                      onClose?.();
                    }}
                    title={item.label}
                  >
                    <span className={`shrink-0 size-8 flex items-center justify-center rounded-full ${isActive ? 'text-white bg-primary-600' : ''}`}>{item.icon}</span>
                    {!isCollapsed && <span className="text-base font-medium leading-snug text-nowrap">{item.label}</span>}

                    {isActive && <span className="absolute h-full w-1.5 bg-primary-600 right-0"></span>}
                  </button>
                );
              })}
            </nav>
          </>
        )}

        {visibleMainMenuItems.length === 0 && visibleMasterMenuItems.length === 0 && !isCollapsed && <p className="px-6 text-sm text-primary-400">Tidak ada menu yang bisa diakses untuk role saat ini.</p>}
      </div>
    </aside>
  );
}
