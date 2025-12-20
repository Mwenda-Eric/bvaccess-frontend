'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils';
import { ChartPeriod, ChartData } from '@/types';
import { CHART_PERIODS } from '@/lib/constants';

interface RevenueChartProps {
  data?: ChartData;
  loading?: boolean;
  onPeriodChange?: (period: ChartPeriod) => void;
  selectedPeriod?: ChartPeriod;
}

export function RevenueChart({
  data,
  loading = false,
  onPeriodChange,
  selectedPeriod = '7d',
}: RevenueChartProps) {
  const [showComparison, setShowComparison] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-1">
              {CHART_PERIODS.map((_, i) => (
                <Skeleton key={i} className="h-8 w-16" />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Safely extract data from backend format
  const labels = data?.labels || [];
  const revenueData = data?.datasets?.[0]?.data || [];
  const previousData = data?.datasets?.[1]?.data;

  // Transform to chart format with safety checks
  const chartData = labels.map((label, index) => ({
    name: label,
    revenue: revenueData[index] ?? 0,
    previousRevenue: previousData?.[index],
  }));

  // Check if there's any actual data to display
  const hasData = chartData.length > 0 && chartData.some(item => item.revenue > 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Revenue Overview</CardTitle>
          <div className="flex flex-wrap gap-1">
            {CHART_PERIODS.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPeriodChange?.(period.value as ChartPeriod)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
        {previousData && previousData.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-fit"
            onClick={() => setShowComparison(!showComparison)}
          >
            {showComparison ? 'Hide' : 'Show'} comparison
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">No revenue data available</p>
              <p className="text-sm">Data will appear here once sales are recorded</p>
            </div>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrencyCompact(value)}
              className="text-muted-foreground"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <p className="font-medium">{payload[0].payload.name}</p>
                      <p className="text-sm text-chart-1">
                        Revenue: {formatCurrency(payload[0].value as number)}
                      </p>
                      {showComparison && payload[1] && (
                        <p className="text-sm text-muted-foreground">
                          Previous: {formatCurrency(payload[1].value as number)}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            {showComparison && (
              <Area
                type="monotone"
                dataKey="previousRevenue"
                stroke="var(--muted-foreground)"
                fillOpacity={1}
                fill="url(#colorPrevious)"
                strokeDasharray="5 5"
                isAnimationActive={false}
              />
            )}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-1)"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
