'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { createInstitution, deleteInstitution, getInstitutionAll, getInstitutionPaginated, updateInstitution } from '../services/institution.service';

export function useInstitutionAll(params?: InstitutionAllParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['institutions/all', params],
    queryFn: () => getInstitutionAll(api, params),
    enabled: isSessionReady,
  });
}

export function useInstitutionPaginated(params: InstitutionPaginatedParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['institutions/paginated', params],
    queryFn: () => getInstitutionPaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateInstitution = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InstitutionPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createInstitution(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions/all'] });
      queryClient.invalidateQueries({ queryKey: ['institutions/paginated'] });
    },
  });
};

export const useUpdateInstitution = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: InstitutionPayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateInstitution(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions/all'] });
      queryClient.invalidateQueries({ queryKey: ['institutions/paginated'] });
    },
  });
};

export const useDeleteInstitution = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteInstitution(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions/all'] });
      queryClient.invalidateQueries({ queryKey: ['institutions/paginated'] });
    },
  });
};
