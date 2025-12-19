'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { ChartPeriod } from '@/types';

// Auto-refresh interval in milliseconds
// Using 10 seconds to balance freshness vs Azure costs
const REFRESH_INTERVAL = 10 * 1000;
const SUMMARY_REFRESH_INTERVAL = 5 * 1000; // Slightly faster for key stats

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary(),
    refetchInterval: SUMMARY_REFRESH_INTERVAL,
    staleTime: 0,
    gcTime: 0, // Don't cache old data
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useRevenueChart(period: ChartPeriod = '7d') {
  return useQuery({
    queryKey: ['dashboard', 'revenue', period],
    queryFn: () => dashboardApi.getRevenueChart(period),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  });
}

export function useSalesByLocation(period: ChartPeriod = '7d') {
  return useQuery({
    queryKey: ['dashboard', 'location', period],
    queryFn: () => dashboardApi.getSalesByLocation(period),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  });
}

export function useSalesByDuration(period: ChartPeriod = '7d') {
  return useQuery({
    queryKey: ['dashboard', 'duration', period],
    queryFn: () => dashboardApi.getSalesByDuration(period),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  });
}

export function usePaymentMethods(period: ChartPeriod = '7d') {
  return useQuery({
    queryKey: ['dashboard', 'payment-methods', period],
    queryFn: () => dashboardApi.getPaymentMethods(period),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  });
}

export function useHourlyHeatmap(period: ChartPeriod = '7d') {
  return useQuery({
    queryKey: ['dashboard', 'hourly-heatmap', period],
    queryFn: () => dashboardApi.getHourlyHeatmap(period),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  });
}

export function useTopOperators(limit: number = 5) {
  return useQuery({
    queryKey: ['dashboard', 'top-operators', limit],
    queryFn: () => dashboardApi.getTopOperators(limit),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  });
}

export function useRecentVouchers(limit: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'recent-vouchers', limit],
    queryFn: () => dashboardApi.getRecentVouchers(limit),
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  });
}

export function useActiveOperators() {
  return useQuery({
    queryKey: ['dashboard', 'active-operators'],
    queryFn: () => dashboardApi.getActiveOperators(),
    refetchInterval: SUMMARY_REFRESH_INTERVAL,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });
}
