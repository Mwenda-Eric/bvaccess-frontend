'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { locationsApi } from '@/lib/api';
import { LocationFilters, PaginationParams, CreateLocationRequest, UpdateLocationRequest } from '@/types';
import { formatApiError } from '@/lib/api/client';
import { toast } from 'sonner';

export function useLocations(params?: PaginationParams & LocationFilters) {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => locationsApi.getList(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useLocation(id: string) {
  return useQuery({
    queryKey: ['locations', id],
    queryFn: () => locationsApi.getById(id),
    enabled: !!id,
  });
}

export function useLocationWithStats(id: string) {
  return useQuery({
    queryKey: ['locations', id, 'stats'],
    queryFn: () => locationsApi.getStats(id),
    enabled: !!id,
  });
}

export function useAllLocations() {
  return useQuery({
    queryKey: ['locations', 'all'],
    queryFn: () => locationsApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLocationRequest) => locationsApi.create(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLocationRequest }) =>
      locationsApi.update(id, data),
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['locations', id] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => locationsApi.delete(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useToggleLocationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      locationsApi.toggleStatus(id, activate),
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['locations', id] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

