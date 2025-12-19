'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api';
import { ReportFilters, ExportFormat } from '@/types';
import { toast } from 'sonner';

export function useDailyReport(date: string, filters?: Omit<ReportFilters, 'date'>) {
  return useQuery({
    queryKey: ['reports', 'daily', date, filters],
    queryFn: () => reportsApi.getDaily(date, filters),
    enabled: !!date,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePeriodReport(
  startDate: string,
  endDate: string,
  filters?: Omit<ReportFilters, 'startDate' | 'endDate'>
) {
  return useQuery({
    queryKey: ['reports', 'period', startDate, endDate, filters],
    queryFn: () => reportsApi.getPeriod(startDate, endDate, filters),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
}

export function useExportDailyReport() {
  return useMutation({
    mutationFn: ({
      date,
      format,
      filters,
    }: {
      date: string;
      format: ExportFormat;
      filters?: Omit<ReportFilters, 'date'>;
    }) => reportsApi.exportDaily(date, format, filters),
    onSuccess: () => {
      toast.success('Report export started. Download will begin shortly.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to export report');
    },
  });
}

export function useExportPeriodReport() {
  return useMutation({
    mutationFn: ({
      startDate,
      endDate,
      format,
      filters,
    }: {
      startDate: string;
      endDate: string;
      format: ExportFormat;
      filters?: Omit<ReportFilters, 'startDate' | 'endDate'>;
    }) => reportsApi.exportPeriod(startDate, endDate, format, filters),
    onSuccess: () => {
      toast.success('Report export started. Download will begin shortly.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to export report');
    },
  });
}
