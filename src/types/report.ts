// Report Types

import { PaymentMethod } from './voucher';

export interface DailyReport {
  date: string;
  summary: DailyReportSummary;
  hourlyBreakdown: HourlyBreakdownItem[];
  locationBreakdown: LocationBreakdownItem[];
  operatorBreakdown: OperatorBreakdownItem[];
  durationBreakdown: DurationBreakdownItem[];
  paymentBreakdown: PaymentBreakdownItem[];
}

export interface DailyReportSummary {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  voidedCount: number;
  voidedAmount: number;
  netRevenue: number;
  peakHour: number;
  peakHourSales: number;
}

export interface HourlyBreakdownItem {
  hour: number;
  salesCount: number;
  revenue: number;
}

export interface LocationBreakdownItem {
  locationId: string;
  locationName: string;
  salesCount: number;
  revenue: number;
  percentage: number;
}

export interface OperatorBreakdownItem {
  operatorId: string;
  operatorName: string;
  locationName: string;
  salesCount: number;
  revenue: number;
  averageTicket: number;
}

export interface DurationBreakdownItem {
  durationMinutes: number;
  label: string;
  salesCount: number;
  revenue: number;
  percentage: number;
}

export interface PaymentBreakdownItem {
  method: PaymentMethod;
  salesCount: number;
  revenue: number;
  percentage: number;
}

export interface PeriodReport {
  startDate: string;
  endDate: string;
  summary: PeriodReportSummary;
  dailyTrend: DailyTrendItem[];
  locationBreakdown: LocationBreakdownItem[];
  operatorBreakdown: OperatorBreakdownItem[];
  comparison?: PeriodComparison;
}

export interface PeriodReportSummary {
  totalDays: number;
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  averageDailySales: number;
  averageDailyRevenue: number;
  voidedCount: number;
  voidedAmount: number;
  netRevenue: number;
  bestDay: {
    date: string;
    revenue: number;
    salesCount: number;
  };
  worstDay: {
    date: string;
    revenue: number;
    salesCount: number;
  };
}

export interface DailyTrendItem {
  date: string;
  salesCount: number;
  revenue: number;
  voidedCount: number;
}

export interface PeriodComparison {
  previousPeriodRevenue: number;
  revenueChange: number;
  revenueChangePercentage: number;
  previousPeriodSales: number;
  salesChange: number;
  salesChangePercentage: number;
}

export interface ReportFilters {
  date?: string;
  startDate?: string;
  endDate?: string;
  locationIds?: string[];
  operatorIds?: string[];
  comparePrevious?: boolean;
}

export type ExportFormat = 'pdf' | 'excel' | 'csv';

export interface ExportRequest {
  format: ExportFormat;
  reportType: 'daily' | 'period';
  filters: ReportFilters;
  includeCharts?: boolean;
}
