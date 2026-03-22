'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { plansApi, wifiCodesApi } from '@/lib/api';
import {
  PlanFilters,
  WifiCodeFilters,
  PaginationParams,
  CreatePlanRequest,
  UpdatePlanRequest,
  GenerateWifiCodesRequest,
} from '@/types';
import { formatApiError } from '@/lib/api/client';
import { toast } from 'sonner';

// ---- Plan hooks ----

export function usePlans(filters?: PlanFilters) {
  return useQuery({
    queryKey: ['plans', filters],
    queryFn: () => plansApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: ['plans', id],
    queryFn: () => plansApi.getById(id),
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlanRequest) => plansApi.create(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanRequest }) =>
      plansApi.update(id, data),
    onSuccess: (result, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plans', id] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plansApi.delete(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function usePlanGroups() {
  return useQuery({
    queryKey: ['plans', 'groups'],
    queryFn: () => plansApi.getGroups(),
  });
}

export function useActivatePlanGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planName: string) => plansApi.activateGroup(planName),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

// ---- WiFi Code hooks ----

export function useWifiCodes(params?: PaginationParams & WifiCodeFilters) {
  return useQuery({
    queryKey: ['wifi-codes', params],
    queryFn: () => wifiCodesApi.getList(params),
    placeholderData: keepPreviousData,
  });
}

export function useGenerateWifiCodes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateWifiCodesRequest) => wifiCodesApi.generate(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['wifi-codes'] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useAssignWifiCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, operatorId }: { id: string; operatorId?: string }) =>
      wifiCodesApi.assign(id, operatorId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['wifi-codes'] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useDeleteWifiCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => wifiCodesApi.delete(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['wifi-codes'] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}
