'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { createTkkBulk, deleteTkk, getTkkPaginated, getTkkSummary, updateTkkLevel, updateTkkLevelBulk } from '../services/tkk.service';

export function useTkkSummary(params: TkkSummaryParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['tkk/summary', params],
    queryFn: () => getTkkSummary(api, params),
    enabled: isSessionReady,
  });
}

export function useTkkPaginated(params: TkkPaginatedParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['tkk/paginated', params],
    queryFn: () => getTkkPaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateTkkBulk = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTkkBulkPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createTkkBulk(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tkk/summary'] });
      queryClient.invalidateQueries({ queryKey: ['tkk/paginated'] });
    },
  });
};

export const useUpdateTkkLevel = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTkkLevelPayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateTkkLevel(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tkk/summary'] });
      queryClient.invalidateQueries({ queryKey: ['tkk/paginated'] });
    },
  });
};

export const useUpdateTkkLevelBulk = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTkkLevelBulkPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateTkkLevelBulk(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tkk/summary'] });
      queryClient.invalidateQueries({ queryKey: ['tkk/paginated'] });
    },
  });
};

export const useDeleteTkk = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteTkk(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tkk/summary'] });
      queryClient.invalidateQueries({ queryKey: ['tkk/paginated'] });
    },
  });
};
