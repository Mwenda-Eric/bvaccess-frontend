'use client';

import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { ChartPeriod } from '@/types';
import { useCallback } from 'react';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary(),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useRevenueChart(period: ChartPeriod = '7d') {
  return useQuery({
    queryKey: ['dashboard', 'revenue', period],
    queryFn: () => dashboardApi.getRevenueChart(period),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useSalesByLocation(period: ChartPeriod = '7d') {
  return useQuery({
    queryKey: ['dashboard', 'location', period],
    queryFn: () => dashboardApi.getSalesByLocation(period),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useSalesByDuration(period: ChartPeriod = '7d') {
  return useQuery({
    queryKey: ['dashboard', 'duration', period],
    queryFn: () => dashboardApi.getSalesByDuration(period),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function usePaymentMethods(period: ChartPeriod = '7d') {
  return useQuery({
    queryKey: ['dashboard', 'payment-methods', period],
    queryFn: () => dashboardApi.getPaymentMethods(period),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useHourlyHeatmap(period: ChartPeriod = '7d') {
  return useQuery({
    queryKey: ['dashboard', 'hourly-heatmap', period],
    queryFn: () => dashboardApi.getHourlyHeatmap(period),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useTopOperators(limit: number = 5) {
  return useQuery({
    queryKey: ['dashboard', 'top-operators', limit],
    queryFn: () => dashboardApi.getTopOperators(limit),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useRecentVouchers(limit: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'recent-vouchers', limit],
    queryFn: () => dashboardApi.getRecentVouchers(limit),
    placeholderData: keepPreviousData,
    staleTime: 0, // Always refetch to get latest vouchers
    refetchOnMount: 'always',
  });
}

export function useActiveOperators() {
  return useQuery({
    queryKey: ['dashboard', 'active-operators'],
    queryFn: () => dashboardApi.getActiveOperators(),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

// Hook to refresh all dashboard data
export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  }, [queryClient]);

  return refresh;
}
