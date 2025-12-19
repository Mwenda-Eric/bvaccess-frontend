'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Download, FileSpreadsheet, FileDown, FileText } from 'lucide-react';
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
import { SingleDatePicker } from '@/components/common';
import { useDailyReport, useExportDailyReport } from '@/hooks';
import { formatCurrency, formatDateForApi } from '@/lib/utils';
import { StatCard } from '@/components/dashboard';
import { DollarSign, Ticket, Ban, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DailyReportPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateString = formatDateForApi(selectedDate);

  const { data: report, isLoading } = useDailyReport(dateString);
  const exportReport = useExportDailyReport();

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    exportReport.mutate({ date: dateString, format });
  };

  const hourlyData = report?.hourlyBreakdown.map((h) => ({
    hour: `${h.hour}:00`,
    sales: h.salesCount,
    revenue: h.revenue,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Report</h1>
          <p className="text-muted-foreground">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SingleDatePicker
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
          />
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
          icon={<DollarSign className="h-6 w-6 text-primary" />}
          loading={isLoading}
        />
        <StatCard
          title="Total Sales"
          value={report?.summary.totalSales?.toLocaleString() || '0'}
          icon={<Ticket className="h-6 w-6 text-primary" />}
          loading={isLoading}
        />
        <StatCard
          title="Voided"
          value={`${report?.summary.voidedCount || 0} (${formatCurrency(report?.summary.voidedAmount || 0)})`}
          icon={<Ban className="h-6 w-6 text-destructive" />}
          loading={isLoading}
        />
        <StatCard
          title="Peak Hour"
          value={report?.summary.peakHour !== undefined ? `${report.summary.peakHour}:00` : '--'}
          icon={<Clock className="h-6 w-6 text-primary" />}
          loading={isLoading}
        />
      </div>

      {/* Hourly Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <p className="font-medium">{payload[0].payload.hour}</p>
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
              <Bar dataKey="sales" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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

      {/* Operator Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>By Operator</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operator</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Avg. Ticket</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report?.operatorBreakdown.map((op) => (
                <TableRow key={op.operatorId}>
                  <TableCell className="font-medium">{op.operatorName}</TableCell>
                  <TableCell>{op.locationName}</TableCell>
                  <TableCell className="text-right">{op.salesCount}</TableCell>
                  <TableCell className="text-right">{formatCurrency(op.revenue)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(op.averageTicket)}</TableCell>
                </TableRow>
              ))}
              {(!report?.operatorBreakdown || report.operatorBreakdown.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
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
