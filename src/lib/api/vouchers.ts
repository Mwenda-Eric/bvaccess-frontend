import {
  Voucher,
  VoucherFilters,
  VoidVoucherRequest,
  VoucherSummary,
  PaginatedResponse,
  PaginationParams,
  OperationResult,
} from '@/types';
import { get, putWithResult, downloadFile } from './client';

export const vouchersApi = {
  // Get vouchers list with pagination and filters
  getList: async (
    params?: PaginationParams & VoucherFilters
  ): Promise<PaginatedResponse<Voucher>> => {
    console.log('[Vouchers API] Fetching vouchers with params:', params);
    const result = await get<PaginatedResponse<Voucher>>('/admin/vouchers', params as Record<string, unknown>);
    console.log('[Vouchers API] Vouchers response:', {
      totalCount: result.pagination?.totalCount,
      itemCount: result.items?.length,
      firstItem: result.items?.[0],
      pagination: result.pagination,
    });
    return result;
  },

  // Get single voucher by ID
  getById: async (id: string): Promise<Voucher> => {
    return get<Voucher>(`/admin/vouchers/${id}`);
  },

  // Get voucher by code (search by code)
  getByCode: async (code: string): Promise<PaginatedResponse<Voucher>> => {
    return get<PaginatedResponse<Voucher>>('/admin/vouchers', { search: code });
  },

  // Void a voucher (PUT not POST per backend spec)
  void: async (id: string, data: VoidVoucherRequest): Promise<OperationResult> => {
    return putWithResult(`/admin/vouchers/${id}/void`, data);
  },

  // Export vouchers to CSV
  exportCsv: async (filters?: VoucherFilters): Promise<void> => {
    const queryParams = new URLSearchParams({ format: 'csv' });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, String(v)));
          } else {
            queryParams.set(key, String(value));
          }
        }
      });
    }
    const filename = `vouchers_${new Date().toISOString().split('T')[0]}.csv`;
    await downloadFile(`/admin/vouchers/export?${queryParams.toString()}`, filename);
  },

  // Export vouchers to Excel
  exportExcel: async (filters?: VoucherFilters): Promise<void> => {
    const queryParams = new URLSearchParams({ format: 'xlsx' });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, String(v)));
          } else {
            queryParams.set(key, String(value));
          }
        }
      });
    }
    const filename = `vouchers_${new Date().toISOString().split('T')[0]}.xlsx`;
    await downloadFile(`/admin/vouchers/export?${queryParams.toString()}`, filename);
  },

  // Search vouchers (uses the same list endpoint with search param)
  search: async (query: string): Promise<Voucher[]> => {
    const result = await get<PaginatedResponse<Voucher>>('/admin/vouchers', { search: query });
    return result.items;
  },
};
