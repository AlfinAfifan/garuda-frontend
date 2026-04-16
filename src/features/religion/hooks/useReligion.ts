'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { createReligion, deleteReligion, getReligionAll, getReligionPaginated, updateReligion } from '../services/religion.service';

export function useReligionAll() {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['religions/all'],
    queryFn: () => getReligionAll(api),
    enabled: isSessionReady,
  });
}

export function useReligionPaginated(params: BaseParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['religions/paginated', params],
    queryFn: () => getReligionPaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateReligion = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReligionPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createReligion(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['religions/all'] });
      queryClient.invalidateQueries({ queryKey: ['religions/paginated'] });
    },
  });
};

export const useUpdateReligion = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReligionPayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateReligion(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['religions/all'] });
      queryClient.invalidateQueries({ queryKey: ['religions/paginated'] });
    },
  });
};

export const useDeleteReligion = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteReligion(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['religions/all'] });
      queryClient.invalidateQueries({ queryKey: ['religions/paginated'] });
    },
  });
};
