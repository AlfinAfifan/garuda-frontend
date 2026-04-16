'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { createMember, deleteMember, getMemberPaginated, updateMember } from '../services/member.service';

export function useMemberPaginated(params: MemberPaginatedParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['members/paginated', params],
    queryFn: () => getMemberPaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateMember = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MemberPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createMember(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members/paginated'] });
    },
  });
};

export const useUpdateMember = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MemberPayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateMember(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members/paginated'] });
    },
  });
};

export const useDeleteMember = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteMember(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members/paginated'] });
    },
  });
};
