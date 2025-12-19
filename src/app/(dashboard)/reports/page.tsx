'use client';

import Link from 'next/link';
import { Calendar, CalendarRange, FileDown, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardSummary } from '@/hooks';
import { formatCurrency } from '@/lib/utils';

export default function ReportsPage() {
  const { data: summary } = useDashboardSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Generate and export reports for your business
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month Revenue</p>
              <p className="text-2xl font-bold">
                {formatCurrency(summary?.thisMonth.totalRevenue || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month Sales</p>
              <p className="text-2xl font-bold">
                {summary?.thisMonth.totalSales?.toLocaleString() || '0'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Ticket</p>
              <p className="text-2xl font-bold">
                {formatCurrency(summary?.thisMonth.averageTicket || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Daily Report</CardTitle>
                <CardDescription>View detailed sales for a specific day</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Get a complete breakdown of sales, revenue, and activity for any single day.
              Includes hourly breakdown, location performance, and operator statistics.
            </p>
            <Button asChild>
              <Link href="/reports/daily">
                Generate Daily Report
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <CalendarRange className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Period Report</CardTitle>
                <CardDescription>Analyze trends over a date range</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Compare performance across multiple days. See daily trends, aggregated
              statistics, and compare with previous periods.
            </p>
            <Button asChild>
              <Link href="/reports/period">
                Generate Period Report
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Export Options
          </CardTitle>
          <CardDescription>
            Reports can be exported in multiple formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">PDF</h4>
              <p className="text-sm text-muted-foreground">
                Formatted report with charts and tables, ready for printing
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">Excel</h4>
              <p className="text-sm text-muted-foreground">
                Spreadsheet format with raw data for further analysis
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">CSV</h4>
              <p className="text-sm text-muted-foreground">
                Simple text format compatible with any software
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
