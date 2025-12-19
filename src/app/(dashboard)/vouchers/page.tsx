'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VoucherFilters, VouchersTable, VoidVoucherDialog } from '@/components/vouchers';
import { useVouchers, useVoidVoucher, useExportVouchers } from '@/hooks';
import { Voucher, VoucherFilters as VoucherFiltersType } from '@/types';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';

export default function VouchersPage() {
  const [filters, setFilters] = useState<VoucherFiltersType>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [voidDialogOpen, setVoidDialogOpen] = useState(false);

  // Fetch vouchers - sorted by most recent first
  const { data, isLoading } = useVouchers({
    page,
    pageSize,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...filters,
  });

  // Mutations
  const voidVoucher = useVoidVoucher();
  const exportVouchers = useExportVouchers();

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
