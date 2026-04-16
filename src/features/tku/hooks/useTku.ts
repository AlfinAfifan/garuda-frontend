'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { createTkuBulk, deleteTku, getTkuPaginated, getTkuSummary, updateTkuLevel, updateTkuLevelBulk } from '../services/tku.service';

export function useTkuSummary(params: TkuSummaryParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['tku/summary', params],
    queryFn: () => getTkuSummary(api, params),
    enabled: isSessionReady,
  });
}

export function useTkuPaginated(params: TkuPaginatedParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['tku/paginated', params],
    queryFn: () => getTkuPaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateTkuBulk = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTkuBulkPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createTkuBulk(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tku/summary'] });
      queryClient.invalidateQueries({ queryKey: ['tku/paginated'] });
    },
  });
};

export const useUpdateTkuLevel = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTkuLevelPayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateTkuLevel(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tku/summary'] });
      queryClient.invalidateQueries({ queryKey: ['tku/paginated'] });
    },
  });
};

export const useUpdateTkuLevelBulk = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTkuLevelBulkPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateTkuLevelBulk(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tku/summary'] });
      queryClient.invalidateQueries({ queryKey: ['tku/paginated'] });
    },
  });
};

export const useDeleteTku = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteTku(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tku/summary'] });
      queryClient.invalidateQueries({ queryKey: ['tku/paginated'] });
    },
  });
};
