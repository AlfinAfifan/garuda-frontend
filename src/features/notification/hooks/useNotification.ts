'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { createNotification, deleteNotification, getNotificationAll, getNotificationPaginated, readAllNotification, readByIdNotification, updateNotification } from '../services/notification.service';

export function useNotificationAll() {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['notifications/all'],
    queryFn: () => getNotificationAll(api),
    enabled: isSessionReady,
  });
}

export function useNotificationPaginated(params: NotificationPaginatedParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['notifications/paginated', params],
    queryFn: () => getNotificationPaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateNotification = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NotificationPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createNotification(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications/all'] });
      queryClient.invalidateQueries({ queryKey: ['notifications/paginated'] });
    },
  });
};

export const useUpdateNotification = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: NotificationPayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateNotification(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications/all'] });
      queryClient.invalidateQueries({ queryKey: ['notifications/paginated'] });
    },
  });
};

export const useDeleteNotification = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteNotification(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications/all'] });
      queryClient.invalidateQueries({ queryKey: ['notifications/paginated'] });
    },
  });
};

export const useReadByIdNotification = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return readByIdNotification(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications/all'] });
      queryClient.invalidateQueries({ queryKey: ['notifications/paginated'] });
    },
  });
};

export const useReadAllNotification = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return readAllNotification(api);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications/all'] });
      queryClient.invalidateQueries({ queryKey: ['notifications/paginated'] });
    },
  });
};
