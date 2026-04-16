'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { createTkkField, deleteTkkField, getTkkFieldAll, getTkkFieldPaginated, updateTkkField } from '../services/tkk-field.service';

export function useTkkFieldAll(params?: TkkFieldAllParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['tkk-field/all', params],
    queryFn: () => getTkkFieldAll(api, params),
    enabled: isSessionReady,
  });
}

export function useTkkFieldPaginated(params: TkkFieldPaginatedParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['tkk-field/paginated', params],
    queryFn: () => getTkkFieldPaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateTkkField = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TkkFieldPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createTkkField(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tkk-field/all'] });
      queryClient.invalidateQueries({ queryKey: ['tkk-field/paginated'] });
    },
  });
};

export const useUpdateTkkField = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TkkFieldPayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateTkkField(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tkk-field/all'] });
      queryClient.invalidateQueries({ queryKey: ['tkk-field/paginated'] });
    },
  });
};

export const useDeleteTkkField = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteTkkField(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tkk-field/all'] });
      queryClient.invalidateQueries({ queryKey: ['tkk-field/paginated'] });
    },
  });
};
