'use client';

import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { Download, FileSpreadsheet, FileDown, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DateRangePicker, CurrencyDisplay } from '@/components/common';
import { StatCard } from '@/components/dashboard';
import { usePeriodReport, useExportPeriodReport } from '@/hooks';
import { formatCurrency, formatDateForApi, cn } from '@/lib/utils';
import { DollarSign, Ticket, Calendar, BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function PeriodReportPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const startDate = dateRange.from ? formatDateForApi(dateRange.from) : '';
  const endDate = dateRange.to ? formatDateForApi(dateRange.to) : '';

  const { data: report, isLoading } = usePeriodReport(startDate, endDate, {
    comparePrevious: true,
  });
  const exportReport = useExportPeriodReport();

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    exportReport.mutate({ startDate, endDate, format });
  };

  const trendData = report?.dailyTrend.map((d) => ({
    date: format(new Date(d.date), 'MMM d'),
    sales: d.salesCount,
    revenue: d.revenue,
  })) || [];

  const comparison = report?.comparison;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Period Report</h1>
          <p className="text-muted-foreground">
            {dateRange.from && dateRange.to
              ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
              : 'Select a date range'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DateRangePicker value={dateRange} onChange={(range) => range && setDateRange(range)} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileDown className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(report?.summary.totalRevenue || 0)}
          change={
            comparison
              ? {
                  value: comparison.revenueChangePercentage,
                  type:
                    comparison.revenueChangePercentage > 0
                      ? 'increase'
                      : comparison.revenueChangePercentage < 0
                      ? 'decrease'
                      : 'neutral',
                }
              : undefined
          }
          icon={<DollarSign className="h-6 w-6 text-primary" />}
          loading={isLoading}
        />
        <StatCard
          title="Total Sales"
          value={report?.summary.totalSales?.toLocaleString() || '0'}
          change={
            comparison
              ? {
                  value: comparison.salesChangePercentage,
                  type:
                    comparison.salesChangePercentage > 0
                      ? 'increase'
                      : comparison.salesChangePercentage < 0
                      ? 'decrease'
                      : 'neutral',
                }
              : undefined
          }
          icon={<Ticket className="h-6 w-6 text-primary" />}
          loading={isLoading}
        />
        <StatCard
          title="Days"
          value={report?.summary.totalDays?.toString() || '0'}
          icon={<Calendar className="h-6 w-6 text-primary" />}
          loading={isLoading}
        />
        <StatCard
          title="Avg. Ticket"
          value={formatCurrency(report?.summary.averageTicket || 0)}
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
          loading={isLoading}
        />
      </div>

      {/* Comparison Cards */}
      {comparison && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue vs Previous Period</p>
                  <CurrencyDisplay amount={comparison.revenueChange} size="lg" />
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 rounded-full px-3 py-1',
                    comparison.revenueChangePercentage >= 0
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  )}
                >
                  {comparison.revenueChangePercentage >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {comparison.revenueChangePercentage >= 0 ? '+' : ''}
                    {comparison.revenueChangePercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sales vs Previous Period</p>
                  <p className="text-2xl font-bold">
                    {comparison.salesChange >= 0 ? '+' : ''}
                    {comparison.salesChange}
                  </p>
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 rounded-full px-3 py-1',
                    comparison.salesChangePercentage >= 0
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  )}
                >
                  {comparison.salesChangePercentage >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {comparison.salesChangePercentage >= 0 ? '+' : ''}
                    {comparison.salesChangePercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Daily Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="font-medium">{payload[0].payload.date}</p>
                        <p className="text-sm">Sales: {payload[0].payload.sales}</p>
                        <p className="text-sm">
                          Revenue: {formatCurrency(payload[0].payload.revenue)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Best/Worst Days */}
      {report?.summary.bestDay && report?.summary.worstDay && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">Best Day</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {format(new Date(report.summary.bestDay.date), 'EEEE, MMM d')}
              </p>
              <p className="text-sm text-muted-foreground">
                {report.summary.bestDay.salesCount} sales |{' '}
                {formatCurrency(report.summary.bestDay.revenue)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Slowest Day</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {format(new Date(report.summary.worstDay.date), 'EEEE, MMM d')}
              </p>
              <p className="text-sm text-muted-foreground">
                {report.summary.worstDay.salesCount} sales |{' '}
                {formatCurrency(report.summary.worstDay.revenue)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Location Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>By Location</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report?.locationBreakdown.map((loc) => (
                <TableRow key={loc.locationId}>
                  <TableCell className="font-medium">{loc.locationName}</TableCell>
                  <TableCell className="text-right">{loc.salesCount}</TableCell>
                  <TableCell className="text-right">{formatCurrency(loc.revenue)}</TableCell>
                  <TableCell className="text-right">{loc.percentage.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
              {(!report?.locationBreakdown || report.locationBreakdown.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
