'use client';

import { useQuery } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { getDashboard } from '../services/dashboard.service';

export function useDashboard(params: DashboardParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['dashboard/overview', params],
    queryFn: () => getDashboard(api, params),
    enabled: isSessionReady,
  });
}
