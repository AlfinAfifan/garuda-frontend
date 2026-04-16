'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { createGarudaBulk, deleteGaruda, getGarudaPaginated, getGarudaSummary, updateApprovalGaruda, updateApprovalGarudaBulk } from '../services/garuda.service';

export function useGarudaSummary(params: GarudaSummaryParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['garuda/summary', params],
    queryFn: () => getGarudaSummary(api, params),
    enabled: isSessionReady,
  });
}

export function useGarudaPaginated(params: GarudaPaginatedParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['garuda/paginated', params],
    queryFn: () => getGarudaPaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateGarudaBulk = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGarudaBulkPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createGarudaBulk(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garuda/summary'] });
      queryClient.invalidateQueries({ queryKey: ['garuda/paginated'] });
    },
  });
};

export const useUpdateApprovalGaruda = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateApprovalGarudaPayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateApprovalGaruda(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garuda/summary'] });
      queryClient.invalidateQueries({ queryKey: ['garuda/paginated'] });
    },
  });
};

export const useUpdateApprovalGarudaBulk = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateApprovalGarudaBulkPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateApprovalGarudaBulk(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garuda/summary'] });
      queryClient.invalidateQueries({ queryKey: ['garuda/paginated'] });
    },
  });
};

export const useDeleteGaruda = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteGaruda(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garuda/summary'] });
      queryClient.invalidateQueries({ queryKey: ['garuda/paginated'] });
    },
  });
};
