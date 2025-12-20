'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils';
import { ChartData } from '@/types';

interface SalesByLocationChartProps {
  data?: ChartData;
  loading?: boolean;
}

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export function SalesByLocationChart({ data, loading = false }: SalesByLocationChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
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

  // Calculate total for percentages
  const totalRevenue = revenueData.reduce((sum, val) => sum + (val || 0), 0);

  // Transform to chart format
  const chartData = labels.slice(0, 5).map((label, index) => {
    const revenue = revenueData[index] ?? 0;
    return {
      name: label.length > 15 ? label.substring(0, 15) + '...' : label,
      fullName: label,
      revenue,
      percentage: totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0,
    };
  });

  // Check if there's any actual data to display
  const hasData = chartData.length > 0 && totalRevenue > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Location</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">No location data available</p>
              <p className="text-sm">Data will appear here once sales are recorded</p>
            </div>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrencyCompact(value)}
              className="text-muted-foreground"
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={100}
              className="text-muted-foreground"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <p className="font-medium">{item.fullName}</p>
                      <p className="text-sm">Revenue: {formatCurrency(item.revenue)}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
