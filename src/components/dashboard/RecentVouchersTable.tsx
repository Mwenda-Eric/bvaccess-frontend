'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/common';
import { formatCurrency, formatRelativeTime, formatDurationShort } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { RecentVoucher } from '@/types';

interface RecentVouchersTableProps {
  data?: RecentVoucher[];
  loading?: boolean;
}

export function RecentVouchersTable({ data, loading = false }: RecentVouchersTableProps) {
  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[RecentVouchersTable] Received data:', data);
    }
  }, [data]);

  // Safely handle data
  const vouchers = data || [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Vouchers</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/vouchers">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell>
                  <Link
                    href={`/vouchers/${voucher.id}`}
                    className="font-mono text-sm hover:text-primary"
                  >
                    {voucher.code}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[120px] truncate">
                  {voucher.locationName}
                </TableCell>
                <TableCell>{formatDurationShort(voucher.durationMinutes)}</TableCell>
                <TableCell>{formatCurrency(voucher.price)}</TableCell>
                <TableCell className="max-w-[100px] truncate">
                  {voucher.operatorName}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatRelativeTime(voucher.createdAt)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={voucher.isVoid ? 'void' : 'active'} size="sm" />
                </TableCell>
              </TableRow>
            ))}
            {vouchers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No recent vouchers
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
