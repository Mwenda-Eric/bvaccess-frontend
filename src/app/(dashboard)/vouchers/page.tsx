'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VoucherFilters, VouchersTable, VoidVoucherDialog } from '@/components/vouchers';
import { useVouchers, useVoidVoucher, useExportVouchers, useRefreshVouchers } from '@/hooks';
import { Voucher, VoucherFilters as VoucherFiltersType } from '@/types';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';

export default function VouchersPage() {
  const [filters, setFilters] = useState<VoucherFiltersType>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch vouchers - sorted by most recent first
  const { data, isLoading, isFetching } = useVouchers({
    page,
    pageSize,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...filters,
  });

  // Mutations and refresh
  const voidVoucher = useVoidVoucher();
  const exportVouchers = useExportVouchers();
  const refreshVouchers = useRefreshVouchers();

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshVouchers();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const isAnyFetching = isFetching || isRefreshing;

  const handleVoidClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setVoidDialogOpen(true);
  };

  const handleVoidConfirm = (reason: string) => {
    if (selectedVoucher) {
      voidVoucher.mutate(
        { id: selectedVoucher.id, reason },
        {
          onSuccess: () => {
            setVoidDialogOpen(false);
            setSelectedVoucher(null);
          },
        }
      );
    }
  };

  const handleExport = (format: 'csv' | 'excel') => {
    exportVouchers.mutate({ format, filters });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vouchers</h1>
          <p className="text-muted-foreground">
            {data?.pagination.totalCount || 0} total vouchers
          </p>
        </div>

        <div className="flex gap-2">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isAnyFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnyFetching ? 'animate-spin' : ''}`} />
            {isAnyFetching ? 'Refreshing...' : 'Refresh'}
          </Button>

          {/* Export Button */}
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              <FileDown className="mr-2 h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('excel')}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <VoucherFilters filters={filters} onFiltersChange={setFilters} />

      {/* Table */}
      <VouchersTable
        vouchers={data?.items || []}
        pagination={data?.pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onVoidClick={handleVoidClick}
        loading={isLoading}
      />

      {/* Void Dialog */}
      <VoidVoucherDialog
        voucher={selectedVoucher}
        open={voidDialogOpen}
        onOpenChange={setVoidDialogOpen}
        onConfirm={handleVoidConfirm}
        isLoading={voidVoucher.isPending}
      />
    </div>
  );
}
