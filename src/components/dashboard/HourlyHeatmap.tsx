'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatCurrency } from '@/lib/utils';
import { HourlyHeatmapData } from '@/types';

interface HourlyHeatmapProps {
  data?: HourlyHeatmapData;
  loading?: boolean;
}

export function HourlyHeatmap({ data, loading = false }: HourlyHeatmapProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Safely extract data from backend format (array of { hour, salesCount, revenue })
  const hourlyData = data || [];

  // Create a 24-hour array with default values
  const hourlyValues: { salesCount: number; revenue: number }[] = Array.from({ length: 24 }, () => ({
    salesCount: 0,
    revenue: 0,
  }));

  // Fill in the data
  hourlyData.forEach((item) => {
    if (item.hour >= 0 && item.hour < 24) {
      hourlyValues[item.hour] = {
        salesCount: item.salesCount ?? 0,
        revenue: item.revenue ?? 0,
      };
    }
  });

  // Calculate max value for intensity
  const maxSales = Math.max(...hourlyValues.map((v) => v.salesCount), 1);

  const getIntensity = (value: number): string => {
    const ratio = value / maxSales;
    if (ratio === 0) return 'bg-muted';
    if (ratio < 0.25) return 'bg-primary/20';
    if (ratio < 0.5) return 'bg-primary/40';
    if (ratio < 0.75) return 'bg-primary/60';
    return 'bg-primary/80';
  };

  // Format hour labels
  const formatHour = (hour: number): string => {
    if (hour === 0) return '12a';
    if (hour === 12) return '12p';
    if (hour < 12) return `${hour}a`;
    return `${hour - 12}p`;
  };

  // Show hours in groups of 4
  const hourLabels = [0, 4, 8, 12, 16, 20].map(formatHour);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Sales Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Hour labels */}
          <div className="flex">
            {hourLabels.map((label, i) => (
              <div
                key={label}
                className="text-xs text-muted-foreground"
                style={{ width: `${100 / 6}%` }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Heatmap row */}
          <div className="flex gap-0.5">
            {hourlyValues.map((value, hourIndex) => (
              <div
                key={hourIndex}
                className={cn(
                  'h-8 flex-1 rounded-sm transition-colors cursor-pointer',
                  getIntensity(value.salesCount)
                )}
                title={`${formatHour(hourIndex)} - ${value.salesCount} sales (${formatCurrency(value.revenue)})`}
              />
            ))}
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Peak Hour</p>
              <p className="font-medium">
                {formatHour(hourlyValues.reduce((maxIdx, val, idx, arr) =>
                  val.salesCount > arr[maxIdx].salesCount ? idx : maxIdx, 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Sales</p>
              <p className="font-medium">
                {hourlyValues.reduce((sum, v) => sum + v.salesCount, 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="font-medium">
                {formatCurrency(hourlyValues.reduce((sum, v) => sum + v.revenue, 0))}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex gap-1">
              <div className="h-3 w-3 rounded-sm bg-muted" />
              <div className="h-3 w-3 rounded-sm bg-primary/20" />
              <div className="h-3 w-3 rounded-sm bg-primary/40" />
              <div className="h-3 w-3 rounded-sm bg-primary/60" />
              <div className="h-3 w-3 rounded-sm bg-primary/80" />
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
