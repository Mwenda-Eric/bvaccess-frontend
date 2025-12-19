'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DataTable, Column, StatusBadge, CurrencyDisplay } from '@/components/common';
import { Voucher, getVoucherStatus, PaginationInfo } from '@/types';
import { formatDateTime, formatDuration } from '@/lib/utils';
import { Eye, Ban } from 'lucide-react';

interface VouchersTableProps {
  vouchers: Voucher[];
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onVoidClick?: (voucher: Voucher) => void;
  loading?: boolean;
  selection?: {
    selected: string[];
    onSelectionChange: (ids: string[]) => void;
  };
}

export function VouchersTable({
  vouchers,
  pagination,
  onPageChange,
  onPageSizeChange,
  onVoidClick,
  loading = false,
  selection,
}: VouchersTableProps) {
  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[VouchersTable] Received vouchers:', vouchers);
      if (vouchers.length > 0) {
        console.log('[VouchersTable] First voucher structure:', JSON.stringify(vouchers[0], null, 2));
      }
    }
  }, [vouchers]);

  const columns: Column<Voucher>[] = [
    {
      key: 'code',
      header: 'Code',
      cell: (voucher) => (
        <Link
          href={`/vouchers/${voucher.id}`}
          className="font-mono text-sm font-medium hover:text-primary"
        >
          {voucher.code}
        </Link>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      cell: (voucher) => (
        <span className="max-w-[150px] truncate">{voucher.locationName || 'N/A'}</span>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      cell: (voucher) => formatDuration(voucher.durationMinutes),
    },
    {
      key: 'bandwidth',
      header: 'Bandwidth',
      cell: (voucher) => voucher.bandwidth || 'N/A',
    },
    {
      key: 'paymentMethod',
      header: 'Payment',
      cell: (voucher) => (
        <span>{voucher.paymentMethod === 'EWallet' ? 'E-Wallet' : voucher.paymentMethod || 'N/A'}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      cell: (voucher) => <CurrencyDisplay amount={voucher.price ?? 0} size="sm" />,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (voucher) => <StatusBadge status={getVoucherStatus(voucher)} size="sm" />,
    },
    {
      key: 'createdBy',
      header: 'Operator',
      cell: (voucher) => (
        <span className="max-w-[120px] truncate">{voucher.operatorName || 'N/A'}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      cell: (voucher) => (
        <span className="text-sm text-muted-foreground">
          {voucher.createdAt ? formatDateTime(voucher.createdAt) : 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (voucher) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/vouchers/${voucher.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          {!voucher.isVoid && onVoidClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onVoidClick(voucher);
              }}
            >
              <Ban className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ),
      className: 'w-[80px]',
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={vouchers}
      loading={loading}
      selection={selection}
      pagination={
        pagination && onPageChange && onPageSizeChange
          ? {
              currentPage: pagination.currentPage,
              totalPages: pagination.totalPages,
              pageSize: pagination.pageSize,
              totalCount: pagination.totalCount,
              onPageChange,
              onPageSizeChange,
            }
          : undefined
      }
    />
  );
}
