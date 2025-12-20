'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { Banknote, Smartphone } from 'lucide-react';
import { ChartData } from '@/types';

interface PaymentMethodsChartProps {
  data?: ChartData;
  loading?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  Cash: 'var(--chart-2)',
  EWallet: 'var(--chart-1)',
  'E-Wallet': 'var(--chart-1)',
  MonCash: 'var(--chart-3)',
  NatCash: 'var(--chart-4)',
  Card: 'var(--chart-5)',
};

const FALLBACK_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const ICON_MAP: Record<string, typeof Banknote> = {
  Cash: Banknote,
  EWallet: Smartphone,
  'E-Wallet': Smartphone,
  MonCash: Smartphone,
  NatCash: Smartphone,
  Card: Smartphone,
};

export function PaymentMethodsChart({ data, loading = false }: PaymentMethodsChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Safely extract data from backend format
  const labels = data?.labels || [];
  const counts = data?.datasets?.[0]?.data || [];
  const revenues = data?.datasets?.[1]?.data || [];

  // Calculate total for percentages
  const totalCount = counts.reduce((sum, val) => sum + (val || 0), 0);

  // Transform to chart format
  const chartData = labels.map((label, index) => {
    const count = counts[index] ?? 0;
    const revenue = revenues[index] ?? 0;
    return {
      name: label,
      value: count,
      revenue,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
      method: label,
    };
  });

  // Check if there's any actual data to display
  const hasData = chartData.length > 0 && totalCount > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[150px] items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">No payment data available</p>
              <p className="text-sm">Data will appear here once sales are recorded</p>
            </div>
          </div>
        ) : (
        <div className="flex items-center gap-8">
          <ResponsiveContainer width={150} height={150}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={5}
                dataKey="value"
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${entry.method}`} fill={COLOR_MAP[entry.method] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm">{item.value} transactions</p>
                        <p className="text-sm">{formatCurrency(item.revenue)}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.percentage.toFixed(1)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex-1 space-y-4">
            {chartData.map((item, index) => {
              const Icon = ICON_MAP[item.method] || Smartphone;
              const color = COLOR_MAP[item.method] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
              return (
                <div key={item.method} className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.value} sales | {formatCurrency(item.revenue)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
}
