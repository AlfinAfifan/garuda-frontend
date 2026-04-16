'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { createCity, deleteCity, getCityAll, getCityPaginated, updateCity } from '../services/city.service';

export function useCityAll() {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['cities/all'],
    queryFn: () => getCityAll(api),
    enabled: isSessionReady,
  });
}

export function useCityPaginated(params: CityPaginatedParams) {
  const { api, isSessionReady } = useApi();

  return useQuery({
    queryKey: ['cities/paginated', params],
    queryFn: () => getCityPaginated(api, params),
    enabled: isSessionReady,
  });
}

export const useCreateCity = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CityPayload) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return createCity(api, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities/all'] });
      queryClient.invalidateQueries({ queryKey: ['cities/paginated'] });
    },
  });
};

export const useUpdateCity = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CityPayload }) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return updateCity(api, id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities/all'] });
      queryClient.invalidateQueries({ queryKey: ['cities/paginated'] });
    },
  });
};

export const useDeleteCity = () => {
  const { api, isSessionReady } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      if (!isSessionReady) {
        throw new Error('Session is not ready yet');
      }

      return deleteCity(api, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities/all'] });
      queryClient.invalidateQueries({ queryKey: ['cities/paginated'] });
    },
  });
};
