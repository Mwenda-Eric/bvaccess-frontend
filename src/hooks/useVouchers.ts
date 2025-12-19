'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vouchersApi } from '@/lib/api';
import { VoucherFilters, PaginationParams } from '@/types';
import { formatApiError } from '@/lib/api/client';
import { toast } from 'sonner';

// Auto-refresh interval in milliseconds
// Using 10 seconds to balance freshness vs Azure costs
const REFRESH_INTERVAL = 10 * 1000;

export function useVouchers(params?: PaginationParams & VoucherFilters) {
  return useQuery({
    queryKey: ['vouchers', params],
    queryFn: () => vouchersApi.getList(params),
    placeholderData: (previousData) => previousData,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: 0,
  });
}

export function useVoucher(id: string) {
  return useQuery({
    queryKey: ['vouchers', id],
    queryFn: () => vouchersApi.getById(id),
    enabled: !!id,
  });
}

export function useVoucherByCode(code: string) {
  return useQuery({
    queryKey: ['vouchers', 'code', code],
    queryFn: () => vouchersApi.getByCode(code),
    enabled: !!code,
  });
}

export function useVoidVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      vouchersApi.void(id, { reason }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(result.message);
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}

export function useExportVouchers() {
  return useMutation({
    mutationFn: async ({
      format,
      filters,
    }: {
      format: 'csv' | 'excel';
      filters?: VoucherFilters;
    }) => {
      if (format === 'csv') {
        await vouchersApi.exportCsv(filters);
      } else {
        await vouchersApi.exportExcel(filters);
      }
    },
    onSuccess: () => {
      toast.success('Export started. Download will begin shortly.');
    },
    onError: (error: unknown) => {
      toast.error(formatApiError(error));
    },
  });
}
