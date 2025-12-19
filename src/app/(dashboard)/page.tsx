'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import {
  DollarSign,
  Ticket,
  Users,
  TrendingUp,
} from 'lucide-react';
import {
  StatCard,
  RevenueChart,
  SalesByLocationChart,
  SalesByDurationChart,
  PaymentMethodsChart,
  TopOperatorsTable,
  RecentVouchersTable,
  HourlyHeatmap,
} from '@/components/dashboard';
import {
  useDashboardSummary,
  useRevenueChart,
  useSalesByLocation,
  useSalesByDuration,
  usePaymentMethods,
  useHourlyHeatmap,
  useTopOperators,
  useRecentVouchers,
  useActiveOperators,
} from '@/hooks';
import { formatCurrency } from '@/lib/utils';
import { ChartPeriod } from '@/types';

export default function DashboardPage() {
  const { data: session } = useSession();
  const t = useTranslations('dashboard');
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('7d');

  // Fetch dashboard data
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: revenueChart, isLoading: revenueLoading } = useRevenueChart(chartPeriod);
  const { data: locationData, isLoading: locationLoading } = useSalesByLocation(chartPeriod);
  const { data: durationData, isLoading: durationLoading } = useSalesByDuration(chartPeriod);
  const { data: paymentData, isLoading: paymentLoading } = usePaymentMethods(chartPeriod);
  const { data: heatmapData, isLoading: heatmapLoading } = useHourlyHeatmap();
  const { data: topOperators, isLoading: operatorsLoading } = useTopOperators(5);
  const { data: recentVouchers, isLoading: vouchersLoading } = useRecentVouchers(10);
  const { data: activeOps, isLoading: activeOpsLoading } = useActiveOperators();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('totalRevenue')}
          value={formatCurrency(summary?.today.totalRevenue || 0)}
          change={
            summary?.percentageChanges
              ? {
                  value: summary.percentageChanges.revenueToday,
                  type:
                    summary.percentageChanges.revenueToday > 0
                      ? 'increase'
                      : summary.percentageChanges.revenueToday < 0
                      ? 'decrease'
                      : 'neutral',
                }
              : undefined
          }
          icon={<DollarSign className="h-6 w-6 text-primary" />}
          loading={summaryLoading}
        />
        <StatCard
          title={t('todaySales')}
          value={summary?.today.totalSales?.toLocaleString() || '0'}
          change={
            summary?.percentageChanges
              ? {
                  value: summary.percentageChanges.salesToday,
                  type:
                    summary.percentageChanges.salesToday > 0
                      ? 'increase'
                      : summary.percentageChanges.salesToday < 0
                      ? 'decrease'
                      : 'neutral',
                }
              : undefined
          }
          icon={<Ticket className="h-6 w-6 text-primary" />}
          loading={summaryLoading}
        />
        <StatCard
          title={t('activeVouchers')}
          value={`${activeOps?.activeToday || 0} / ${activeOps?.total || 0}`}
          icon={<Users className="h-6 w-6 text-primary" />}
          loading={activeOpsLoading}
        />
        <StatCard
          title={t('thisWeek')}
          value={formatCurrency(summary?.thisWeek.totalRevenue || 0)}
          change={
            summary?.percentageChanges
              ? {
                  value: summary.percentageChanges.revenueWeek,
                  type:
                    summary.percentageChanges.revenueWeek > 0
                      ? 'increase'
                      : summary.percentageChanges.revenueWeek < 0
                      ? 'decrease'
                      : 'neutral',
                }
              : undefined
          }
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
          loading={summaryLoading}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RevenueChart
            data={revenueChart}
            loading={revenueLoading}
            selectedPeriod={chartPeriod}
            onPeriodChange={setChartPeriod}
          />
        </div>
        <div className="lg:col-span-2">
          <SalesByLocationChart data={locationData} loading={locationLoading} />
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SalesByDurationChart data={durationData} loading={durationLoading} />
        <PaymentMethodsChart data={paymentData} loading={paymentLoading} />
        <HourlyHeatmap data={heatmapData} loading={heatmapLoading} />
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentVouchersTable data={recentVouchers} loading={vouchersLoading} />
        </div>
        <div>
          <TopOperatorsTable data={topOperators} loading={operatorsLoading} />
        </div>
      </div>
    </div>
  );
}
