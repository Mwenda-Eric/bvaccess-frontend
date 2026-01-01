// Dashboard Types

import { PaymentMethod } from './voucher';

export interface DashboardSummary {
  today: PeriodStats;
  yesterday: PeriodStats;
  thisWeek: PeriodStats;
  lastWeek: PeriodStats;
  thisMonth: PeriodStats;
  lastMonth: PeriodStats;
  percentageChanges: PercentageChanges;
}

export interface PeriodStats {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  voidedCount: number;
  voidedAmount: number;
}

export interface PercentageChanges {
  salesToday: number;
  revenueToday: number;
  salesWeek: number;
  revenueWeek: number;
  salesMonth: number;
  revenueMonth: number;
}

// Backend chart data format
export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// Alias types for specific charts (all use the same backend format)
export type RevenueChartData = ChartData;
export type SalesByLocationData = ChartData;
export type SalesByDurationData = ChartData;
export type PaymentMethodsData = ChartData;

// Frontend-friendly transformed format for components
export interface TransformedChartData {
  labels: string[];
  data: number[];
  previousPeriodData?: number[];
}

export interface LocationSalesItem {
  locationId: string;
  locationName: string;
  revenue: number;
  salesCount: number;
  percentage: number;
}

export interface DurationSalesItem {
  durationMinutes: number;
  label: string;
  count: number;
  percentage: number;
}

export interface PaymentMethodItem {
  method: PaymentMethod;
  count: number;
  revenue: number;
  percentage: number;
}

// Hourly distribution from backend
export interface HourlyDistribution {
  hour: number;
  salesCount: number;
  revenue: number;
}

export type HourlyHeatmapData = HourlyDistribution[];

export interface HourlyDataPoint {
  day: number;  // 0-6 (Sunday-Saturday)
  hour: number; // 0-23
  value: number;
}

export interface TopOperator {
  id: string;
  fullName: string;
  username: string;
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
}

export interface RecentVoucher {
  id: string;
  code: string;
  locationName: string;
  durationMinutes: number;
  price: number;
  operatorName: string;
  createdAt: string;
  isVoid: boolean;
}

export interface ActiveOperatorsCount {
  activeToday: number;
  total: number;
}

export interface PeriodSummary {
  period: string;
  periodLabel: string;
  currentPeriod: PeriodStats;
  previousPeriod: PeriodStats;
  salesChange: number;
  revenueChange: number;
}

export type ChartPeriod = '7d' | '30d' | '90d' | '12m';

export interface SparklineData {
  values: number[];
  labels: string[];
}
