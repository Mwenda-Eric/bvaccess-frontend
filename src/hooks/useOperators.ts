'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operatorsApi } from '@/lib/api';
import { OperatorFilters, PaginationParams, CreateOperatorRequest, UpdateOperatorRequest } from '@/types';
import { formatApiError } from '@/lib/api/client';
import { toast } from 'sonner';

export function useOperators(params?: PaginationParams & OperatorFilters) {
  return useQuery({
    queryKey: ['operators', params],
    queryFn: () => operatorsApi.getList(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useOperator(id: string) {
  return useQuery({
    queryKey: ['operators', id],
    queryFn: () => operatorsApi.getById(id),
    enabled: !!id,
  });
}

export function useOperatorActivity(id: string, days: number = 30) {
  return useQuery({
    queryKey: ['operators', id, 'activity', days],
    queryFn: () => operatorsApi.getActivity(id, days),
    enabled: !!id,
  });
}

// Alias for backward compatibility - uses regular operator data
export function useOperatorWithStats(id: string) {
  return useQuery({
    queryKey: ['operators', id],
    queryFn: () => operatorsApi.getById(id),
    enabled: !!id,
  });
}

export function useAllOperators() {
  return useQuery({
    queryKey: ['operators', 'all'],
    queryFn: () => operatorsApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateOperator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOperatorRequest) => operatorsApi.create(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useUpdateOperator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOperatorRequest }) =>
      operatorsApi.update(id, data),
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['operators', id] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useDeleteOperator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => operatorsApi.delete(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useToggleOperatorStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      operatorsApi.toggleStatus(id, activate),
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['operators', id] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useResetOperatorPassword() {
  return useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      operatorsApi.resetPassword(id, newPassword),
    onSuccess: (result) => {
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useOperatorDailySales(id: string, days: number = 30) {
  return useQuery({
    queryKey: ['operators', id, 'daily-sales', days],
    queryFn: () => operatorsApi.getDailySales(id, days),
    enabled: !!id,
  });
}
