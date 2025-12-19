import {
  DailyReport,
  PeriodReport,
  ReportFilters,
  ExportFormat,
} from '@/types';
import { get, post, downloadFile } from './client';

// Transform backend response to frontend format
const transformDailyReport = (data: Record<string, unknown>): DailyReport => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Reports API] Raw daily report response:', data);
  }

  // Handle if data is already in correct format
  if (data.summary && typeof data.summary === 'object') {
    return data as unknown as DailyReport;
  }

  // Handle if backend returns flat structure or PascalCase
  // Check for PascalCase fields at root level
  const summary: DailyReport['summary'] = {
    totalSales: (data.TotalSales ?? data.totalSales ?? 0) as number,
    totalRevenue: (data.TotalRevenue ?? data.totalRevenue ?? 0) as number,
    averageTicket: (data.AverageTicket ?? data.averageTicket ?? 0) as number,
    voidedCount: (data.VoidedCount ?? data.voidedCount ?? 0) as number,
    voidedAmount: (data.VoidedAmount ?? data.voidedAmount ?? 0) as number,
    netRevenue: (data.NetRevenue ?? data.netRevenue ?? 0) as number,
    peakHour: (data.PeakHour ?? data.peakHour ?? 0) as number,
    peakHourSales: (data.PeakHourSales ?? data.peakHourSales ?? 0) as number,
  };

  // Check if Summary is PascalCase
  if (data.Summary && typeof data.Summary === 'object') {
    const s = data.Summary as Record<string, unknown>;
    summary.totalSales = (s.TotalSales ?? s.totalSales ?? summary.totalSales) as number;
    summary.totalRevenue = (s.TotalRevenue ?? s.totalRevenue ?? summary.totalRevenue) as number;
    summary.averageTicket = (s.AverageTicket ?? s.averageTicket ?? summary.averageTicket) as number;
    summary.voidedCount = (s.VoidedCount ?? s.voidedCount ?? summary.voidedCount) as number;
    summary.voidedAmount = (s.VoidedAmount ?? s.voidedAmount ?? summary.voidedAmount) as number;
    summary.netRevenue = (s.NetRevenue ?? s.netRevenue ?? summary.netRevenue) as number;
    summary.peakHour = (s.PeakHour ?? s.peakHour ?? summary.peakHour) as number;
    summary.peakHourSales = (s.PeakHourSales ?? s.peakHourSales ?? summary.peakHourSales) as number;
  }

  return {
    date: (data.Date ?? data.date ?? '') as string,
    summary,
    hourlyBreakdown: (data.HourlyBreakdown ?? data.hourlyBreakdown ?? []) as DailyReport['hourlyBreakdown'],
    locationBreakdown: (data.LocationBreakdown ?? data.locationBreakdown ?? []) as DailyReport['locationBreakdown'],
    operatorBreakdown: (data.OperatorBreakdown ?? data.operatorBreakdown ?? []) as DailyReport['operatorBreakdown'],
    durationBreakdown: (data.DurationBreakdown ?? data.durationBreakdown ?? []) as DailyReport['durationBreakdown'],
    paymentBreakdown: (data.PaymentBreakdown ?? data.paymentBreakdown ?? []) as DailyReport['paymentBreakdown'],
  };
};

export const reportsApi = {
  // Get daily report
  getDaily: async (date: string, filters?: Omit<ReportFilters, 'date'>): Promise<DailyReport> => {
    const data = await get<Record<string, unknown>>('/admin/reports/daily', { date, ...filters } as Record<string, unknown>);
    return transformDailyReport(data);
  },

  // Get period report
  getPeriod: async (
    startDate: string,
    endDate: string,
    filters?: Omit<ReportFilters, 'startDate' | 'endDate'>
  ): Promise<PeriodReport> => {
    return get<PeriodReport>('/admin/reports/period', {
      from: startDate,
      to: endDate,
      ...filters
    } as Record<string, unknown>);
  },

  // Get operator report
  getOperatorReport: async (
    operatorId: string,
    startDate?: string,
    endDate?: string
  ): Promise<PeriodReport> => {
    return get<PeriodReport>(`/admin/reports/operator/${operatorId}`, {
      from: startDate,
      to: endDate,
    } as Record<string, unknown>);
  },

  // Get location report
  getLocationReport: async (
    locationId: string,
    startDate?: string,
    endDate?: string
  ): Promise<PeriodReport> => {
    return get<PeriodReport>(`/admin/reports/location/${locationId}`, {
      from: startDate,
      to: endDate,
    } as Record<string, unknown>);
  },

  // Generate report (sends to email or returns file)
  generateReport: async (
    reportType: 'daily' | 'weekly' | 'monthly' | 'custom',
    format: ExportFormat,
    options?: {
      dateFrom?: string;
      dateTo?: string;
      emailTo?: string[];
      includeCharts?: boolean;
    }
  ): Promise<void> => {
    await post('/admin/reports/generate', {
      reportType,
      format,
      ...options,
    });
  },

  // Export daily report (via vouchers export)
  exportDaily: async (
    date: string,
    format: ExportFormat,
    filters?: Omit<ReportFilters, 'date'>
  ): Promise<void> => {
    const queryParams = new URLSearchParams({
      format: format === 'excel' ? 'xlsx' : format,
      dateFrom: date,
      dateTo: date,
    });
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

    const extensions: Record<ExportFormat, string> = {
      pdf: 'pdf',
      excel: 'xlsx',
      csv: 'csv',
    };

    const filename = `daily_report_${date}.${extensions[format]}`;
    await downloadFile(`/admin/vouchers/export?${queryParams.toString()}`, filename);
  },

  // Export period report (via vouchers export)
  exportPeriod: async (
    startDate: string,
    endDate: string,
    format: ExportFormat,
    filters?: Omit<ReportFilters, 'startDate' | 'endDate'>
  ): Promise<void> => {
    const queryParams = new URLSearchParams({
      format: format === 'excel' ? 'xlsx' : format,
      dateFrom: startDate,
      dateTo: endDate,
    });
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

    const extensions: Record<ExportFormat, string> = {
      pdf: 'pdf',
      excel: 'xlsx',
      csv: 'csv',
    };

    const filename = `period_report_${startDate}_${endDate}.${extensions[format]}`;
    await downloadFile(`/admin/vouchers/export?${queryParams.toString()}`, filename);
  },
};
