'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartData } from '@/types';

interface SalesByDurationChartProps {
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

export function SalesByDurationChart({ data, loading = false }: SalesByDurationChartProps) {
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

  // Calculate total for percentages
  const totalCount = counts.reduce((sum, val) => sum + (val || 0), 0);

  // Transform to chart format
  const chartData = labels.map((label, index) => {
    const count = counts[index] ?? 0;
    return {
      name: label,
      value: count,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
    };
  });

  // Check if there's any actual data to display
  const hasData = chartData.length > 0 && totalCount > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Duration</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">No duration data available</p>
              <p className="text-sm">Data will appear here once sales are recorded</p>
            </div>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              isAnimationActive={false}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm">{item.value} sales</p>
                      <p className="text-sm text-muted-foreground">
                        {item.percentage.toFixed(1)}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              formatter={(value, entry) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
