'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createProvince, deleteProvince, getProvinceAll, getProvincePaginated, updateProvince } from '@/features/region/services/province.service';
import { useApi } from '@/hooks/useApi';

export function useProvinceAll() {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['provinces/all'],
    queryFn: () => getProvinceAll(api),
    enabled: isSessionReady,
  });
}

export function useProvincePaginated(params: BaseParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['provinces/paginated', params],
    queryFn: () => getProvincePaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateProvince = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProvincePayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createProvince(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provinces/all'] });
      queryClient.invalidateQueries({ queryKey: ['provinces/paginated'] });
    },
  });
};

export const useUpdateProvince = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProvincePayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateProvince(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provinces/all'] });
      queryClient.invalidateQueries({ queryKey: ['provinces/paginated'] });
    },
  });
};

export const useDeleteProvince = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteProvince(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provinces/all'] });
      queryClient.invalidateQueries({ queryKey: ['provinces/paginated'] });
    },
  });
};
