import {
  DashboardSummary,
  PeriodSummary,
  RevenueChartData,
  SalesByLocationData,
  SalesByDurationData,
  PaymentMethodsData,
  HourlyHeatmapData,
  TopOperator,
  RecentVoucher,
  ActiveOperatorsCount,
  ChartPeriod,
  SparklineData,
} from '@/types';
import { get } from './client';

// Map frontend period values to backend expected values
const mapPeriodToBackend = (period: ChartPeriod): string => {
  const periodMap: Record<ChartPeriod, string> = {
    '7d': '7days',
    '30d': '30days',
    '90d': '90days',
    '12m': '12months',
  };
  return periodMap[period] || '12months';
};

export const dashboardApi = {
  // Get dashboard summary statistics
  getSummary: async (): Promise<DashboardSummary> => {
    const data = await get<DashboardSummary>('/admin/dashboard/summary');
    if (process.env.NODE_ENV === 'development') {
      console.log('[Dashboard API] Summary response:', data);
    }
    return data;
  },

  // Get summary stats for a specific period
  getSummaryByPeriod: async (period: ChartPeriod = '12m'): Promise<PeriodSummary> => {
    const backendPeriod = mapPeriodToBackend(period);
    const data = await get<PeriodSummary>(`/admin/dashboard/summary/${backendPeriod}`);
    if (process.env.NODE_ENV === 'development') {
      console.log('[Dashboard API] Period summary response:', data);
    }
    return data;
  },

  // Get revenue chart data
  getRevenueChart: async (period: ChartPeriod = '12m'): Promise<RevenueChartData> => {
    const data = await get<RevenueChartData>('/admin/dashboard/charts/revenue', {
      period: mapPeriodToBackend(period)
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('[Dashboard API] Revenue chart response:', {
        period: mapPeriodToBackend(period),
        rawData: data,
        labels: data?.labels,
        datasets: data?.datasets,
        firstDataset: data?.datasets?.[0],
      });
    }
    return data;
  },

  // Get sales by location
  getSalesByLocation: async (period: ChartPeriod = '12m'): Promise<SalesByLocationData> => {
    return get<SalesByLocationData>('/admin/dashboard/charts/sales-by-location', {
      period: mapPeriodToBackend(period)
    });
  },

  // Get sales by duration
  getSalesByDuration: async (period: ChartPeriod = '12m'): Promise<SalesByDurationData> => {
    return get<SalesByDurationData>('/admin/dashboard/charts/sales-by-duration', {
      period: mapPeriodToBackend(period)
    });
  },

  // Get payment methods distribution
  getPaymentMethods: async (period: ChartPeriod = '12m'): Promise<PaymentMethodsData> => {
    return get<PaymentMethodsData>('/admin/dashboard/charts/payment-methods', {
      period: mapPeriodToBackend(period)
    });
  },

  // Get hourly distribution data (heatmap)
  getHourlyHeatmap: async (period: ChartPeriod = '12m'): Promise<HourlyHeatmapData> => {
    return get<HourlyHeatmapData>('/admin/dashboard/hourly-distribution', {
      period: mapPeriodToBackend(period)
    });
  },

  // Get top operators
  getTopOperators: async (limit: number = 5, period: ChartPeriod = '12m'): Promise<TopOperator[]> => {
    return get<TopOperator[]>('/admin/dashboard/top-operators', {
      limit,
      period: mapPeriodToBackend(period)
    });
  },

  // Get recent vouchers (from vouchers list with small page size)
  getRecentVouchers: async (limit: number = 10): Promise<RecentVoucher[]> => {
    console.log('[Dashboard API] Fetching recent vouchers with limit:', limit);
    const result = await get<{ items: RecentVoucher[]; pagination?: unknown }>('/admin/vouchers', {
      pageSize: limit,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    console.log('[Dashboard API] Raw result object:', result);
    console.log('[Dashboard API] Result keys:', Object.keys(result || {}));
    console.log('[Dashboard API] Recent vouchers response:', {
      hasItems: 'items' in (result || {}),
      itemCount: result?.items?.length,
      firstItem: result?.items?.[0],
      allItems: result?.items,
    });
    return result?.items || [];
  },

  // Get active operators count (calculated from operators list)
  getActiveOperators: async (): Promise<ActiveOperatorsCount> => {
    const operators = await get<{ id: string; isActive: boolean }[]>('/admin/operators');
    const total = operators.length;
    const activeToday = operators.filter(op => op.isActive).length;
    return { total, activeToday };
  },
};
