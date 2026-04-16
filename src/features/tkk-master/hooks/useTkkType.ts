'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { createTkkType, deleteTkkType, getTkkTypeAll, getTkkTypePaginated, updateTkkType } from '../services/tkk-type.service';

export function useTkkTypeAll(params?: TkkTypeAllParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['tkk-type/all', params],
    queryFn: () => getTkkTypeAll(api, params),
    enabled: isSessionReady,
  });
}

export function useTkkTypePaginated(params: TkkTypePaginatedParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['tkk-type/paginated', params],
    queryFn: () => getTkkTypePaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateTkkType = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TkkTypePayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createTkkType(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tkk-type/all'] });
      queryClient.invalidateQueries({ queryKey: ['tkk-type/paginated'] });
    },
  });
};

export const useUpdateTkkType = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TkkTypePayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateTkkType(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tkk-type/all'] });
      queryClient.invalidateQueries({ queryKey: ['tkk-type/paginated'] });
    },
  });
};

export const useDeleteTkkType = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteTkkType(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tkk-type/all'] });
      queryClient.invalidateQueries({ queryKey: ['tkk-type/paginated'] });
    },
  });
};
