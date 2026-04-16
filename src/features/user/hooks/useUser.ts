'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { createUser, deleteUser, getUserAll, getUserPaginated, updateStatusUser, updateUser } from '../services/user.service';

export function useUserAll(params?: UserAllParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['users/all', params],
    queryFn: () => getUserAll(api, params ?? {}),
    enabled: isSessionReady,
  });
}

export function useUserPaginated(params: UserPaginatedParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['users/paginated', params],
    queryFn: () => getUserPaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateUser = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createUser(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users/all'] });
      queryClient.invalidateQueries({ queryKey: ['users/paginated'] });
    },
  });
};

export const useUpdateUser = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserPayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateUser(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users/all'] });
      queryClient.invalidateQueries({ queryKey: ['users/paginated'] });
    },
  });
};

export const useUpdateStatusUser = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStatusUserPayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateStatusUser(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users/all'] });
      queryClient.invalidateQueries({ queryKey: ['users/paginated'] });
    },
  });
};

export const useDeleteUser = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteUser(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users/all'] });
      queryClient.invalidateQueries({ queryKey: ['users/paginated'] });
    },
  });
};
