'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { createDistrict, deleteDistrict, getDistrictAll, getDistrictPaginated, updateDistrict } from '../services/district.service';

export function useDistrictAll(params?: Record<string, any>) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['districts/all', params],
    queryFn: () => getDistrictAll(api, params),
    enabled: isSessionReady,
  });
}

export function useDistrictPaginated(params: DistrictPaginatedParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['districts/paginated', params],
    queryFn: () => getDistrictPaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateDistrict = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DistrictPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createDistrict(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts/all'] });
      queryClient.invalidateQueries({ queryKey: ['districts/paginated'] });
    },
  });
};

export const useUpdateDistrict = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DistrictPayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateDistrict(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts/all'] });
      queryClient.invalidateQueries({ queryKey: ['districts/paginated'] });
    },
  });
};

export const useDeleteDistrict = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteDistrict(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts/all'] });
      queryClient.invalidateQueries({ queryKey: ['districts/paginated'] });
    },
  });
};
